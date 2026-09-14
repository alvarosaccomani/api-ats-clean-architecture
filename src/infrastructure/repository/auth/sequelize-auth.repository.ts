import * as bcrypt from "bcryptjs";
import { UserEntity } from "../../../domain/user/user.entity";
import { AuthRepository } from "../../../domain/auth/auth.repository";
import { SequelizeUser } from "../../model/user/user.model";
import { SequelizeApplication } from "../../model/application/application.model";
import { SequelizeUserCompany } from "../../model/user-company/user-company.model";
import { SequelizeCompany } from "../../model/company/company.model";
import { SequelizeSubscription } from "../../model/subscription/subscription.model";
import { SequelizePlan } from "../../model/plan/plan.model";
import { createToken } from "../../services/jwt.service";
import { AuthService } from '../../services/auth-service.service';
import { emailService } from '../../services/email-service.service';
import { generateToken, hashToken, calculateExpiration } from '../../services/token-service.service';
import { Op } from 'sequelize';

export class SequelizeAuthRepository implements AuthRepository {
    async loginUser(identifier: string, usr_password: string, gettoken: boolean): Promise<UserEntity | String | null> {
        try {
            const user = await SequelizeUser.findOne({ 
                where: { 
                    [Op.or]: [
                        { usr_nick: identifier ?? null },
                        { usr_email: identifier ?? null }
                    ]
                }
            });            
            
            if(!user) {
                throw new Error(`No hay usuario con el identificador: ${identifier}`);
            }
            
            if(!user.usr_confirmed) {
                throw new Error(`El usuario ${identifier} no se encuentra confirmado`);
            } 
            
            const isPasswordValid = await bcrypt.compare(usr_password, user.dataValues.usr_password);
            if(!isPasswordValid) {
                throw new Error('El password es incorrecto');
            }
            
            if(gettoken) {
                return createToken(user.dataValues);
            }
            
            user.dataValues.usr_password = '';
            return user.dataValues as UserEntity;
        } catch (error: any) {
            console.error('Error en loginUser:', error.message);
            throw error;
        }
    }

    async registerUser(user: UserEntity, app_cod?: string): Promise<UserEntity | null> {
        try {
            const authService = new AuthService(process.env.JWT_SECRET || 'default_secret');

            let { usr_uuid, usr_name, usr_surname, usr_password, usr_image, usr_email, usr_nick, usr_bio, usr_registered, usr_socket, usr_online, usr_confirmed, usr_confirmationtoken, usr_resetpasswordtoken, usr_resetpasswordexpires, usr_sysadmin, usr_createdat, usr_updatedat } = user;

            const userExist = await SequelizeUser.findOne({ 
                where: {
                    [Op.or]: [
                        { usr_nick: usr_nick ?? null },
                        { usr_email: usr_email ?? null }
                    ]
                }
            });
            
            if(userExist) {
                throw new Error(`Ya existe un usuario con el nombre: ${usr_nick} y email: ${usr_email}`);
            }

            const salt = await bcrypt.genSalt(10);
            usr_password = await bcrypt.hash(usr_password, salt);

            const result = await SequelizeUser.create({ usr_uuid, usr_name, usr_surname, usr_password, usr_image, usr_email, usr_nick, usr_bio, usr_registered, usr_socket, usr_online, usr_confirmed, usr_confirmationtoken, usr_resetpasswordtoken, usr_resetpasswordexpires, usr_sysadmin, usr_createdat, usr_updatedat });
            
            if (!result) {
                throw new Error('No se ha registrado el usuario');
            }
    
            const confirmationToken = authService.generateConfirmationToken(usr_email);
    
            await SequelizeUser.update(
                { usr_confirmationtoken: confirmationToken },
                { where: { usr_uuid } }
            );
    
            try {
                const app = await SequelizeApplication.findOne({
                    where: { app_cod: app_cod || 'Central' },
                    include: [{ association: 'settings' }]
                });

                const settingsMap = (app?.settings || []).reduce((acc: any, curr: any) => {
                    acc[curr.apps_key] = curr.apps_value;
                    return acc;
                }, {} as Record<string, string>);

                await emailService.sendConfirmationEmail(usr_email, confirmationToken, app, settingsMap);
            } catch (emailError) {
                console.error('Error al enviar el correo de confirmación:', emailError);
            }
    
            return result.dataValues as SequelizeUser;
        } catch (error: any) {
            console.error('Error al registrar el usuario:', error);
            throw error;
        }
    }

    async confirmAccount( usr_confirmationtoken: string ): Promise<UserEntity | null> {
        const authService = new AuthService(process.env.JWT_SECRET || 'default_secret');

        if (!usr_confirmationtoken) {
            throw new Error('Token de confirmación no proporcionado.');
        }
    
        try {
            const decoded = authService.verifyToken(usr_confirmationtoken.toString()) as { email: string };
            const user = await SequelizeUser.findOne({ where: { usr_email: decoded.email } });
    
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
    
            await SequelizeUser.update({ usr_confirmed: true }, { where: { usr_email: decoded.email } });
    
            const updatedUser = await SequelizeUser.findOne({
                where: { usr_email: decoded.email },
                attributes: {
                    exclude: ['usr_password'],
                },
            });
 
            if (!updatedUser) {
                throw new Error('Error al recuperar el usuario actualizado.');
            }
 
            return updatedUser;
        } catch (error: any) {
            console.error('Error al confirmar la cuenta:', error.message);
            throw new Error('El token de confirmación es inválido o ha expirado.');
        }
    }

    async forgotPassword( user: UserEntity, app_cod?: string ): Promise<UserEntity | null> {
        try {
            const resetToken = generateToken();
            const hashedToken = hashToken(resetToken);
            const expiration = calculateExpiration();
 
            await SequelizeUser.update(
                { usr_resetpasswordtoken: hashedToken, usr_resetpasswordexpires: expiration },
                { where: { usr_uuid: user.usr_uuid } }
            );
 
            try {
                const app = await SequelizeApplication.findOne({
                    where: { app_cod: app_cod || 'Central' },
                    include: [{ association: 'settings' }]
                });

                const settingsMap = (app?.settings || []).reduce((acc: any, curr: any) => {
                    acc[curr.apps_key] = curr.apps_value;
                    return acc;
                }, {} as Record<string, string>);

                await emailService.sendReestablishmentEmail(user.usr_email, resetToken, app, settingsMap);
            } catch (emailError) {
                console.error('Error al enviar el correo para reestablecer el email:', emailError);
                throw new Error('Error al enviar el correo para reestablecer el email:');
            }
     
            return user;
        } catch (error: any) {
            console.error('Error al guardar el token:', error.message);
            throw new Error('Error al guardar el token de restablecimiento.');
        }
    }

    async findUserByResetToken( token: string, expirationDate: Date ): Promise<UserEntity | null> {
        try {
            const hashedToken = hashToken(token);
            const user = await SequelizeUser.findOne({
              where: {
                usr_resetpasswordtoken: hashedToken,
                usr_resetpasswordexpires: { [Op.gt]: expirationDate },
              },
            });
            return user;
        } catch (error) {
            throw new Error('Error al buscar el usuario por token.');
        }
    }

    async findUserByNick( usr_nick: string ): Promise<UserEntity | null> {
        try {
            const user = await SequelizeUser.findOne({
              where: { usr_nick: usr_nick },
            });
            return user;
        } catch (error) {
            throw new Error('Error al buscar el usuario por nick.');
        }
    }

    async findUserByEmail(usr_email: string): Promise<UserEntity | null> {
        try {
            const user = await SequelizeUser.findOne({ 
                where: { usr_email: usr_email ?? null }
            });
            return user;
        } catch (error: any) {
            console.error('Error en findUserByEmail:', error.message);
            throw error;
        }
    }

    async updatePassword( usr_uuid: string, newPassword: string ): Promise<void> {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await SequelizeUser.update(
                {
                    usr_password: hashedPassword,
                    usr_resetpasswordtoken: null,
                    usr_resetpasswordexpires: null,
                },
                { where: { usr_uuid: usr_uuid } }
            );
        } catch (error) {
            throw new Error('Error al actualizar la contraseña.');
        }
    }

    async checkUserAppAccess(userIdentifier: string, app_cod: string): Promise<any> {
        try {
            const user = await SequelizeUser.findOne({
                where: {
                    [Op.or]: [
                        { usr_uuid: userIdentifier },
                        { usr_email: userIdentifier },
                        { usr_nick: userIdentifier }
                    ]
                },
                attributes: { exclude: ['usr_password'] }
            });

            if (!user) {
                return {
                    userExists: false,
                    hasAccess: false,
                    reason: `No se encontró ningún usuario con el identificador '${userIdentifier}'.`,
                    user: null,
                    app: null,
                    stores: []
                };
            }

            const app = await SequelizeApplication.findOne({
                where: { app_cod: app_cod }
            });

            if (!app) {
                return {
                    userExists: true,
                    hasAccess: false,
                    reason: `La aplicación con código '${app_cod}' no existe en el sistema.`,
                    user: {
                        usr_uuid: user.usr_uuid,
                        usr_nick: user.usr_nick,
                        usr_email: user.usr_email,
                        usr_name: user.usr_name,
                        usr_surname: user.usr_surname,
                        usr_sysadmin: !!user.usr_sysadmin
                    },
                    app: null,
                    stores: []
                };
            }

            const userCompanies = await SequelizeUserCompany.findAll({
                where: {
                    usr_uuid: user.usr_uuid,
                    usrcmp_active: true
                },
                include: [
                    {
                        model: SequelizeCompany,
                        as: 'company',
                        where: { cmp_active: true }
                    }
                ]
            });

            const stores: any[] = [];
            for (const item of userCompanies) {
                const cmp = (item as any).company;
                if (!cmp) continue;

                const sub = await SequelizeSubscription.findOne({
                    where: {
                        sub_subscribertype: 'COMPANY',
                        cmp_uuid: cmp.cmp_uuid,
                        app_uuid: app.app_uuid,
                        sub_active: true
                    },
                    include: [
                        { model: SequelizePlan, as: 'plan' }
                    ]
                });

                if (sub) {
                    stores.push({
                        cmp_uuid: cmp.cmp_uuid,
                        cmp_cod: cmp.cmp_cod,
                        cmp_name: cmp.cmp_name,
                        cmp_cuit: cmp.cmp_cuit,
                        cmp_address: cmp.cmp_address,
                        cmp_phone: cmp.cmp_phone,
                        cmp_email: cmp.cmp_email,
                        usrcmp_role: item.usrcmp_role,
                        subscription: {
                            sub_uuid: sub.sub_uuid,
                            sub_status: sub.sub_status,
                            sub_startsat: sub.sub_startsat,
                            sub_endsat: sub.sub_endsat,
                            plan_name: (sub as any).plan?.pla_name || 'N/A'
                        }
                    });
                }
            }

            const directSub = await SequelizeSubscription.findOne({
                where: {
                    sub_subscribertype: 'USER',
                    usr_uuid: user.usr_uuid,
                    app_uuid: app.app_uuid,
                    sub_active: true
                }
            });

            let hasAccess = false;
            let accessType = 'NO_ACCESS';
            let reason = 'El usuario no posee suscripciones activas para esta aplicación.';

            if (user.usr_sysadmin) {
                hasAccess = true;
                accessType = 'SYSADMIN';
                reason = 'Acceso concedido por privilegio de Administrador Global (SysAdmin).';
            } else if (directSub) {
                hasAccess = true;
                accessType = 'DIRECT_SUBSCRIPTION';
                reason = 'Acceso concedido por suscripción directa de usuario.';
            } else if (stores.length > 0) {
                hasAccess = true;
                accessType = 'COMPANY_SUBSCRIPTION';
                reason = `Acceso concedido a través de ${stores.length} tienda(s)/empresa(s) asociada(s).`;
            }

            return {
                userExists: true,
                hasAccess,
                accessType,
                reason,
                user: {
                    usr_uuid: user.usr_uuid,
                    usr_nick: user.usr_nick,
                    usr_email: user.usr_email,
                    usr_name: user.usr_name,
                    usr_surname: user.usr_surname,
                    usr_sysadmin: !!user.usr_sysadmin
                },
                app: {
                    app_uuid: app.app_uuid,
                    app_cod: app.app_cod,
                    app_name: app.app_name,
                    app_url: app.app_url,
                    app_active: app.app_active
                },
                stores
            };
        } catch (error: any) {
            console.error('Error en checkUserAppAccess:', error.message);
            throw error;
        }
    }
}
