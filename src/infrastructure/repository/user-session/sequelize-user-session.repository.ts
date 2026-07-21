import { UserSessionEntity, UserSessionUpdateData } from "../../../domain/user-session/user-session.entity";
import { UserSessionRepository } from "../../../domain/user-session/user-session.repository";
import { SequelizeUserSession } from "../../model/user-session/user-session.model";
import { SequelizeUser } from "../../model/user/user.model";

export class SequelizeUserSessionRepository implements UserSessionRepository {
    async getUserSessions(usr_uuid: string): Promise<UserSessionEntity[] | null> {
        try {
            const sessions = await SequelizeUserSession.findAll({
                where: { usr_uuid },
                include: [{ model: SequelizeUser, as: 'user', attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email'] }],
                order: [['usrs_updatedat', 'DESC']]
            });
            return sessions;
        } catch (error: any) {
            console.error('Error en getUserSessions:', error.message);
            throw error;
        }
    }

    async findUserSessionById(usr_uuid: string, usrs_uuid: string): Promise<UserSessionEntity | null> {
        try {
            const session = await SequelizeUserSession.findOne({
                where: { usrs_uuid: usrs_uuid ?? null },
                include: [{ model: SequelizeUser, as: 'user' }]
            });
            if (!session) {
                throw new Error(`No se encontró la sesión con Id: ${usrs_uuid}`);
            }
            return session.dataValues;
        } catch (error: any) {
            console.error('Error en findUserSessionById:', error.message);
            throw error;
        }
    }

    async createUserSession(usersession: UserSessionEntity): Promise<UserSessionEntity | null> {
        try {
            const created = await SequelizeUserSession.create(usersession as any);
            return created.dataValues;
        } catch (error: any) {
            console.error('Error en createUserSession:', error.message);
            throw error;
        }
    }

    async updateUserSession(usr_uuid: string, usrs_uuid: string, updateData: UserSessionUpdateData): Promise<UserSessionEntity | null> {
        try {
            const [updatedRows] = await SequelizeUserSession.update(updateData, {
                where: { usrs_uuid }
            });
            if (updatedRows === 0) {
                throw new Error(`No se pudo actualizar la sesión con Id: ${usrs_uuid}`);
            }
            const updated = await SequelizeUserSession.findByPk(usrs_uuid);
            return updated ? updated.dataValues : null;
        } catch (error: any) {
            console.error('Error en updateUserSession:', error.message);
            throw error;
        }
    }

    async deleteUserSession(usr_uuid: string, usrs_uuid: string): Promise<UserSessionEntity | null> {
        try {
            const session = await SequelizeUserSession.findByPk(usrs_uuid);
            if (!session) {
                throw new Error(`No se encontró la sesión con Id: ${usrs_uuid}`);
            }
            await SequelizeUserSession.destroy({
                where: { usrs_uuid }
            });
            return session.dataValues;
        } catch (error: any) {
            console.error('Error en deleteUserSession:', error.message);
            throw error;
        }
    }
}
