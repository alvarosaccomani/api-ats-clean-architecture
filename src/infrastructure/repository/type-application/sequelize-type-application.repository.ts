import { TypeApplicationEntity, TypeApplicationUpdateData } from "../../../domain/type-application/type-application.entity";
import { TypeApplicationRepository } from "../../../domain/type-application/type-application.repository";
import { SequelizeTypeApplication } from "../../model/type-application/type-application.model";
import { Op } from 'sequelize';

export class SequelizeTypeApplicationRepository implements TypeApplicationRepository {
    async getTypeApplications(): Promise<TypeApplicationEntity[] | null> {
        try {
            const typeApplications = await SequelizeTypeApplication.findAll();
            return typeApplications;
        } catch (error: any) {
            console.error('Error en getTypeApplications:', error.message);
            throw error;
        }
    }

    async findTypeApplicationById(tapp_uuid: string): Promise<TypeApplicationEntity | null> {
        try {
            const typeApplication = await SequelizeTypeApplication.findOne({
                where: { tapp_uuid: tapp_uuid ?? null }
            });
            if (!typeApplication) {
                throw new Error(`No se encontró el tipo de aplicación con Id: ${tapp_uuid}`);
            }
            return typeApplication.dataValues;
        } catch (error: any) {
            console.error('Error en findTypeApplicationById:', error.message);
            throw error;
        }
    }

    async createTypeApplication(typeApplication: TypeApplicationEntity): Promise<TypeApplicationEntity | null> {
        try {
            const created = await SequelizeTypeApplication.create(typeApplication as any);
            return created.dataValues;
        } catch (error: any) {
            console.error('Error en createTypeApplication:', error.message);
            throw error;
        }
    }

    async updateTypeApplication(tapp_uuid: string, updateData: TypeApplicationUpdateData): Promise<TypeApplicationEntity | null> {
        try {
            const [updatedRows] = await SequelizeTypeApplication.update(updateData, {
                where: { tapp_uuid }
            });
            if (updatedRows === 0) {
                throw new Error(`No se pudo actualizar el tipo de aplicación con Id: ${tapp_uuid}`);
            }
            const updated = await SequelizeTypeApplication.findByPk(tapp_uuid);
            return updated ? updated.dataValues : null;
        } catch (error: any) {
            console.error('Error en updateTypeApplication:', error.message);
            throw error;
        }
    }

    async deleteTypeApplication(tapp_uuid: string): Promise<TypeApplicationEntity | null> {
        try {
            const typeApp = await SequelizeTypeApplication.findByPk(tapp_uuid);
            if (!typeApp) {
                throw new Error(`No se encontró el tipo de aplicación con Id: ${tapp_uuid}`);
            }
            await SequelizeTypeApplication.destroy({
                where: { tapp_uuid }
            });
            return typeApp.dataValues;
        } catch (error: any) {
            console.error('Error en deleteTypeApplication:', error.message);
            throw error;
        }
    }

    async findTypeApplicationByName(tapp_cod: string, tapp_name: string): Promise<TypeApplicationEntity | null> {
        try {
            const typeApp = await SequelizeTypeApplication.findOne({
                where: {
                    [Op.or]: [
                        { tapp_cod: tapp_cod ?? null },
                        { tapp_name: tapp_name ?? null }
                    ]
                }
            });
            return typeApp ? typeApp.dataValues : null;
        } catch (error: any) {
            console.error('Error en findTypeApplicationByName:', error.message);
            throw error;
        }
    }
}
