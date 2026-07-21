import { UserAuthLogEntity, UserAuthLogUpdateData } from "../../../domain/user-auth-log/user-auth-log.entity";
import { UserAuthLogRepository } from "../../../domain/user-auth-log/user-auth-log.repository";
import { SequelizeUserAuthLog } from "../../model/user-auth-log/user-auth-log.model";
import { SequelizeUser } from "../../model/user/user.model";
import { SequelizeApplication } from "../../model/application/application.model";

export class SequelizeUserAuthLogRepository implements UserAuthLogRepository {
    async getUserAuthLogs(usr_uuid?: string): Promise<UserAuthLogEntity[] | null> {
        try {
            const whereClause = usr_uuid ? { usr_uuid } : {};
            const logs = await SequelizeUserAuthLog.findAll({
                where: whereClause,
                include: [
                    { model: SequelizeUser, as: 'user', attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email', 'usr_nick'] },
                    { model: SequelizeApplication, as: 'application', attributes: ['app_uuid', 'app_cod', 'app_name'] }
                ],
                order: [['usraulo_createdat', 'DESC']]
            });
            return logs;
        } catch (error: any) {
            console.error('Error en getUserAuthLogs:', error.message);
            throw error;
        }
    }

    async findUserAuthLogById(usr_uuid: string, usraulo_uuid: string): Promise<UserAuthLogEntity | null> {
        try {
            const log = await SequelizeUserAuthLog.findOne({
                where: { usraulo_uuid: usraulo_uuid ?? null },
                include: [
                    { model: SequelizeUser, as: 'user' },
                    { model: SequelizeApplication, as: 'application' }
                ]
            });
            if (!log) {
                throw new Error(`No se encontró el registro de auditoría con Id: ${usraulo_uuid}`);
            }
            return log.dataValues;
        } catch (error: any) {
            console.error('Error en findUserAuthLogById:', error.message);
            throw error;
        }
    }

    async createUserAuthLog(userauthlog: UserAuthLogEntity): Promise<UserAuthLogEntity | null> {
        try {
            const created = await SequelizeUserAuthLog.create(userauthlog as any);
            return created.dataValues;
        } catch (error: any) {
            console.error('Error en createUserAuthLog:', error.message);
            throw error;
        }
    }

    async updateUserAuthLog(usr_uuid: string, usraulo_uuid: string, updateData: UserAuthLogUpdateData): Promise<UserAuthLogEntity | null> {
        try {
            const [updatedRows] = await SequelizeUserAuthLog.update(updateData, {
                where: { usraulo_uuid }
            });
            if (updatedRows === 0) {
                throw new Error(`No se pudo actualizar la auditoría con Id: ${usraulo_uuid}`);
            }
            const updated = await SequelizeUserAuthLog.findByPk(usraulo_uuid);
            return updated ? updated.dataValues : null;
        } catch (error: any) {
            console.error('Error en updateUserAuthLog:', error.message);
            throw error;
        }
    }

    async deleteUserAuthLog(usr_uuid: string, usraulo_uuid: string): Promise<UserAuthLogEntity | null> {
        try {
            const log = await SequelizeUserAuthLog.findByPk(usraulo_uuid);
            if (!log) {
                throw new Error(`No se encontró la auditoría con Id: ${usraulo_uuid}`);
            }
            await SequelizeUserAuthLog.destroy({
                where: { usraulo_uuid }
            });
            return log.dataValues;
        } catch (error: any) {
            console.error('Error en deleteUserAuthLog:', error.message);
            throw error;
        }
    }
}
