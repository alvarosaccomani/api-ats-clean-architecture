import * as bcrypt from "bcryptjs";
import { UserEntity } from "../../../domain/user/user.entity";
import { AuthRepository } from "../../../domain/auth/auth.repository";
import { SequelizeUser } from "../../model/user/user.model";
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

    async registerUser(user: UserEntity): Promise<UserEntity | null> {
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
                await emailService.sendConfirmationEmail(usr_email, confirmationToken);
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

    async forgotPassword( user: UserEntity ): Promise<UserEntity | null> {
        try {
            const resetToken = generateToken();
            const hashedToken = hashToken(resetToken);
            const expiration = calculateExpiration();
 
            await SequelizeUser.update(
                { usr_resetpasswordtoken: hashedToken, usr_resetpasswordexpires: expiration },
                { where: { usr_uuid: user.usr_uuid } }
            );
 
            try {
                await emailService.sendReestablishmentEmail(user.usr_email, resetToken);
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
}
