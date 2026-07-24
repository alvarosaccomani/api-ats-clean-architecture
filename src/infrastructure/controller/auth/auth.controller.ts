import { Request, Response } from "express";
import { AuthUseCase } from "../../../application/auth/auth-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { SequelizeUserAuthLogRepository } from "../../repository/user-auth-log/sequelize-user-auth-log.repository";
import { UserAuthLogValue } from "../../../domain/user-auth-log/user-auth-log.value";
import * as jwt from 'jsonwebtoken';
import moment from 'moment';
import { createToken } from "../../services/jwt.service";
import { SequelizeUser } from "../../model/user/user.model";

export class AuthController {
    constructor(private authUseCase: AuthUseCase, private socketAdapter: SocketAdapter) {
        this.loginCtrl = this.loginCtrl.bind(this);
        this.registerCtrl = this.registerCtrl.bind(this);
        this.confirmCtrl = this.confirmCtrl.bind(this);
        this.forgotCtrl = this.forgotCtrl.bind(this);
        this.resetCtrl = this.resetCtrl.bind(this);
        this.userNickExistCtrl = this.userNickExistCtrl.bind(this);
        this.userEmailExistCtrl = this.userEmailExistCtrl.bind(this);
        this.generateSSOTokenCtrl = this.generateSSOTokenCtrl.bind(this);
        this.verifySSOTokenCtrl = this.verifySSOTokenCtrl.bind(this);
    }

    public async loginCtrl(req: Request, res: Response) {
        try {
            const { usr_user, usr_password, gettoken } = req.body;
            const result = await this.authUseCase.loginUser(usr_user, usr_password, gettoken);
    
            const userObj = typeof result === 'string' ? null : (result as any);
            const usr_uuid = userObj?.usr_uuid || 'ANONYMOUS';
            const token = typeof result === 'string' ? result : createToken(userObj);
 
            // Registro automático de auditoría LOGIN_SUCCESS
            try {
                const logRepo = new SequelizeUserAuthLogRepository();
                const logVal = new UserAuthLogValue({
                    usr_uuid,
                    app_uuid: req.body.app_uuid || 'ATS_CENTRAL',
                    usraulo_action: 'LOGIN_SUCCESS',
                    usraulo_ipaddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
                    usraulo_useragent: req.headers['user-agent'] || 'Unknown',
                    usraulo_failurereason: ''
                });
                await logRepo.createUserAuthLog(logVal);
                this.socketAdapter.emitEvent('auth_log_created', logVal);
            } catch (logErr: any) {
                console.error('Error al guardar log de auditoría:', logErr.message);
            }
 
            return res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso.',
                data: {
                    token,
                    user: userObj
                }
            });
        } catch (error: any) {
            console.error('Error en loginCtrl (controller):', error.message);

            // Registro automático de auditoría LOGIN_FAILED
            try {
                const logRepo = new SequelizeUserAuthLogRepository();
                const logVal = new UserAuthLogValue({
                    usr_uuid: 'UNKNOWN',
                    app_uuid: req.body.app_uuid || 'ATS_CENTRAL',
                    usraulo_action: 'LOGIN_FAILED',
                    usraulo_ipaddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
                    usraulo_useragent: req.headers['user-agent'] || 'Unknown',
                    usraulo_failurereason: error.message || 'Credenciales incorrectas'
                });
                await logRepo.createUserAuthLog(logVal);
                this.socketAdapter.emitEvent('auth_log_created', logVal);
            } catch (logErr: any) {
                console.error('Error al guardar log de falla:', logErr.message);
            }

            return res.status(400).json({
                success: false,
                message: 'No se pudo iniciar sesión.',
                error: error.message,
            });
        }
    }

    public async registerCtrl({ body }: Request, res: Response) {
        try {
            const user = await this.authUseCase.registerUser(body);
            res.send({ user });
        } catch (error: any) {
            console.error('Error en registerCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo crear el usuario.',
                error: error.message,
            });
        }
    }

    public async confirmCtrl({ body }: Request, res: Response) {
        try {
            const token = body.token;
            const user = await this.authUseCase.confirmAccount(token);
            res.send({ user });
        } catch (error: any) {
            console.error('Error en confirmCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo confirmar la cuenta.',
                error: error.message,
            });
        }
    }

    public async forgotCtrl({ body }: Request, res: Response) {
        try {
            const usr_email = body.usr_email;

            if (!usr_email) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo electrónico es obligatorio.',
                });
            }
            const user = await this.authUseCase.forgotPassword(usr_email);
            return res.status(200).json({
                success: true,
                message: 'El correo electrónico fue enviado correctamente.',
                data: user,
            });
        } catch (error: any) {
            console.error('Error en forgotCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo reestablecer la contraseña.',
                error: error.message,
            });
        }
    }

    public async resetCtrl({ body }: Request, res: Response) {
        try {
            const { token, newPassword } = body;

            if (!token || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'El token y la nueva contraseña son obligatorios.',
                });
            }

            const expirationDate = new Date();
            const user = await this.authUseCase.getUserByResetToken(token, expirationDate);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'El token es inválido o ha expirado.',
                });
            }

            await this.authUseCase.updatePassword(user.usr_uuid, newPassword);

            return res.status(200).json({
                success: true,
                message: 'Tu contraseña ha sido restablecida con éxito.',
            });

        } catch (error: any) {
            console.error('Error en resetCtrl (controller):', error.message);
            return res.status(500).json({
                success: false,
                message: 'Ocurrió un error al procesar la solicitud.',
            });
        }
    }

    public async userNickExistCtrl({ body }: Request, res: Response) {
        try {
            const usr_nick = body.usr_nick;

            if (!usr_nick) {
                return res.status(400).json({
                    success: false,
                    message: 'El nick de usuario es obligatorio.',
                });
            }
            const exists = await this.authUseCase.userNickExist(usr_nick);
            
            return res.status(200).json({
                success: true,
                message: exists ? 'El nick de usuario existe.' : 'El nick de usuario no existe.',
                data: exists,
            });
        } catch (error: any) {
            console.error('Error en userNickExistCtrl (controller):', error.message);
            return res.status(500).json({
                success: false,
                message: 'No se pudo verificar el nick de usuario.',
                error: error.message,
            });
        }
    }

    public async userEmailExistCtrl({ body }: Request, res: Response) {
        try {
            const usr_email = body.usr_email;

            if (!usr_email) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo electrónico es obligatorio.',
                });
            }
            const exists = await this.authUseCase.userEmailExist(usr_email);
            
            return res.status(200).json({
                success: true,
                message: exists ? 'El correo electrónico existe.' : 'El correo electrónico no existe.',
                data: exists,
            });
        } catch (error: any) {
            console.error('Error en userEmailExistCtrl (controller):', error.message);
            return res.status(500).json({
                success: false,
                message: 'No se pudo verificar el correo electrónico.',
                error: error.message,
            });
        }
    }

    public async generateSSOTokenCtrl(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const { app_uuid } = req.body;
            if (!app_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'El identificador de aplicación (app_uuid) es requerido.'
                });
            }

            const secret = process.env.JWT_SECRET || 'web_app_atssuite_api';
            const payload = {
                sub: user.sub || user.usr_uuid,
                app_uuid,
                type: 'SSO_EXCHANGE',
                iat: moment().unix(),
                exp: moment().add(5, 'minutes').unix()
            };

            const token = jwt.sign(payload, secret);
            return res.status(200).json({
                success: true,
                message: 'Token SSO temporal generado.',
                data: { token }
            });
        } catch (error: any) {
            console.error('Error en generateSSOTokenCtrl:', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo generar el token SSO.',
                error: error.message
            });
        }
    }

    public async verifySSOTokenCtrl(req: Request, res: Response) {
        try {
            const { sso_token } = req.body;
            if (!sso_token) {
                return res.status(400).json({
                    success: false,
                    message: 'El token SSO (sso_token) es requerido.'
                });
            }

            const secret = process.env.JWT_SECRET || 'web_app_atssuite_api';
            const decoded = jwt.verify(sso_token, secret) as any;

            if (decoded.type !== 'SSO_EXCHANGE') {
                throw new Error('Tipo de token inválido para intercambio SSO.');
            }

            // Buscar datos extendidos del usuario para devolver al satélite
            const user = await SequelizeUser.findByPk(decoded.sub);
            if (!user) {
                throw new Error('El usuario no existe en la base de datos central.');
            }

            // Generar token de sesión de larga duración
            const sessionToken = createToken(user.dataValues);
            
            return res.status(200).json({
                success: true,
                message: 'Token SSO verificado correctamente.',
                data: {
                    token: sessionToken,
                    user: {
                        usr_uuid: user.usr_uuid,
                        usr_email: user.usr_email,
                        usr_name: user.usr_name,
                        usr_surname: user.usr_surname,
                        usr_sysadmin: !!user.usr_sysadmin
                    }
                }
            });
        } catch (error: any) {
            console.error('Error en verifySSOTokenCtrl:', error.message);
            return res.status(400).json({
                success: false,
                message: 'Token SSO inválido o expirado.',
                error: error.message
            });
        }
    }
}
