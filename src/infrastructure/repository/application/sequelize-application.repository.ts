import { ApplicationEntity, ApplicationUpdateData } from "../../../domain/application/application.entity";
import { ApplicationRepository } from "../../../domain/application/application.repository";
import { SequelizeApplication } from "../../model/application/application.model";
import { Op } from 'sequelize';

export class SequelizeApplicationRepository implements ApplicationRepository {
    async getApplications(): Promise<ApplicationEntity[] | null> {
        try {
            const applications = await SequelizeApplication.findAll();
            return applications;
        } catch (error: any) {
            console.error('Error en getApplication:', error.message);
            throw error;
        }
    }

    async findApplicationById(app_uuid: string): Promise<ApplicationEntity | null> {
        try {
            const application = await SequelizeApplication.findOne({
                where: { app_uuid: app_uuid ?? null }
            });
            if (!application) {
                throw new Error(`No se encontró la aplicación con Id: ${app_uuid}`);
            }
            return application.dataValues;
        } catch (error: any) {
            console.error('Error en findApplicationById:', error.message);
            throw error;
        }
    }

    async createApplication(application: ApplicationEntity): Promise<ApplicationEntity | null> {
        try {
            const applicationCreated = await SequelizeApplication.create(application as any);
            return applicationCreated.dataValues;
        } catch (error: any) {
            console.error('Error en createApplication:', error.message);
            throw error;
        }
    }

    async updateApplication(app_uuid: string, applicationData: ApplicationUpdateData): Promise<ApplicationEntity | null> {
        try {
            const [updatedRows] = await SequelizeApplication.update(applicationData, {
                where: { app_uuid }
            });
            if (updatedRows === 0) {
                throw new Error(`No se pudo actualizar la aplicación con Id: ${app_uuid}`);
            }
            const updatedApplication = await SequelizeApplication.findByPk(app_uuid);
            return updatedApplication ? updatedApplication.dataValues : null;
        } catch (error: any) {
            console.error('Error en updateApplication:', error.message);
            throw error;
        }
    }

    async deleteApplication(app_uuid: string): Promise<ApplicationEntity | null> {
        try {
            const application = await SequelizeApplication.findByPk(app_uuid);
            if (!application) {
                throw new Error(`No se encontró la aplicación con Id: ${app_uuid}`);
            }
            await SequelizeApplication.destroy({
                where: { app_uuid }
            });
            return application.dataValues;
        } catch (error: any) {
            console.error('Error en deleteApplication:', error.message);
            throw error;
        }
    }

    async findApplicationByName(app_cod: string, app_name: string): Promise<ApplicationEntity | null> {
        try {
            const application = await SequelizeApplication.findOne({
                where: {
                    [Op.or]: [
                        { app_cod: app_cod ?? null },
                        { app_name: app_name ?? null }
                    ]
                }
            });
            return application ? application.dataValues : null;
        } catch (error: any) {
            console.error('Error en findApplicationByName:', error.message);
            throw error;
        }
    }
}
