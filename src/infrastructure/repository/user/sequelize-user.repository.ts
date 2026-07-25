import * as bcrypt from "bcryptjs";
import { UserEntity, UserUpdateData } from "../../../domain/user/user.entity";
import { UserRepository } from "../../../domain/user/user.repository";
import { SequelizeUser } from "../../model/user/user.model";
import { Op } from 'sequelize';
import { DbErrorHandler } from '../../utils/db-error-handler';

export class SequelizeRepository implements UserRepository {
    async getUsers(): Promise<UserEntity[] | null> {
        try {
            const users = await SequelizeUser.findAll();
            if(!users) {
                throw new Error(`No hay usuarios`);
            };
            return users;
        } catch (error: any) {
            console.error('Error en getUsers:', error.message);
            throw error;
        }
    }

    async findUserById(usr_uuid: string): Promise<UserEntity | null> {
        try {
            const user = await SequelizeUser.findOne({ 
                where: { usr_uuid: usr_uuid ?? null }
            });
            if(!user) {
                throw new Error(`No hay usuario con el Id: ${usr_uuid}`);
            };
            return user.dataValues;
        } catch (error: any) {
            console.error('Error en findUserById:', error.message);
            throw error;
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

    async saveUser(user: UserEntity): Promise<UserEntity | null> {
        try {
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

            if (usr_password) {
                const salt = await bcrypt.genSalt(10);
                usr_password = await bcrypt.hash(usr_password, salt);
            }

            const result = await SequelizeUser.create({ usr_uuid, usr_name, usr_surname, usr_password, usr_image, usr_email, usr_nick, usr_bio, usr_registered, usr_socket, usr_online, usr_confirmed, usr_confirmationtoken, usr_resetpasswordtoken, usr_resetpasswordexpires, usr_sysadmin, usr_createdat, usr_updatedat });
            
            if (!result) {
                throw new Error('No se ha registrado el usuario');
            }
    
            return result.dataValues as SequelizeUser;
        } catch (error: any) {
            console.error('Error al guardar el usuario:', error);
            throw error;
        }
    }

    async updateUser(usr_uuid: string, user: UserUpdateData): Promise<UserEntity | null> {
        try {
            const [updatedCount, [updatedUser]] = await SequelizeUser.update(
                { 
                    usr_name: user.usr_name,
                    usr_surname: user.usr_surname,
                    usr_password: user.usr_password,
                    usr_image: user.usr_image,
                    usr_email: user.usr_email,
                    usr_nick: user.usr_nick,
                    usr_bio: user.usr_bio,
                    usr_registered: user.usr_registered,
                    usr_socket: user.usr_socket,
                    usr_online: user.usr_online,
                    usr_sysadmin: user.usr_sysadmin,
                    usr_confirmed: user.usr_confirmed
                }, 
                { 
                    where: { usr_uuid },
                    returning: true,
                }
            );
            if (updatedCount === 0) {
                throw new Error(`No se ha actualizado el usuario`);
            };
            return updatedUser.get({ plain: true }) as UserEntity;
        } catch (error: any) {
            console.error('Error en updateUser:', error.message);
            throw error;
        }
    }

    async deleteUser(usr_uuid: string): Promise<UserEntity | null> {
        try {
            const user = await this.findUserById(usr_uuid);
            const result = await SequelizeUser.destroy({ 
                where: { usr_uuid: usr_uuid ?? null } 
            });
            if(!result) {
                throw new Error(`No se ha eliminado el usuario`);
            };
            return user;
        } catch (error: any) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw new Error(DbErrorHandler.handle(error));
            }
            console.error('Error en deleteUser:', error.message);
            throw error;
        }
    }

    async userExist(usr_nick: string, usr_email: string): Promise<UserEntity | null> {
        try {
            const user = await SequelizeUser.findOne({ 
                where: { 
                    usr_nick: usr_nick ?? null,
                    usr_email: usr_email ?? null
                } 
            });
            return user;
        } catch (error: any) {
            console.error('Error en userExist:', error.message);
            throw error;
        }
    }

    async setSocketUser( usr_uuid: string, usr_socket: string, usr_online: boolean = true ): Promise<UserEntity | null> {
        try {
            const result = await SequelizeUser.update({ usr_socket, usr_online }, { where: { usr_uuid } });
            const user = this.findUserById(usr_uuid);
            if(result[0] < 1) {
                throw new Error(`No se ha podido actualizar el socket`);
            };
            return user;
        } catch (error: any) {
            console.error('Error en setSocketUser:', error.message);
            throw error;
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

    async findSocketUser( usr_uuid: string ): Promise<string | null> {
        try {
            const user = await SequelizeUser.findOne({
              where: { usr_uuid: usr_uuid },
              attributes: ["usr_socket"]
            });
            if (!user) {
                return null;
            }
            return user.getDataValue("usr_socket");
        } catch (error) {
            throw new Error('Error al buscar el socket del usuario.');
        }
    }
}