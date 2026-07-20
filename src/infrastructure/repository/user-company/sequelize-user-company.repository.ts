import { UserCompanyEntity, UserCompanyUpdateData } from "../../../domain/user-company/user-company.entity";
import { UserCompanyRepository } from "../../../domain/user-company/user-company.repository";
import { SequelizeUserCompany } from "../../model/user-company/user-company.model";
import { SequelizeCompany } from "../../model/company/company.model";

export class SequelizeUserCompanyRepository implements UserCompanyRepository {
    async getUserCompanies(): Promise<UserCompanyEntity[] | null> {
        try {
            const relations = await SequelizeUserCompany.findAll({
                include: [{ model: SequelizeCompany, as: 'company' }]
            });
            return relations;
        } catch (error: any) {
            console.error('Error en getUserCompanies:', error.message);
            throw error;
        }
    }

    async findUserCompanyById(usrcmp_uuid: string): Promise<UserCompanyEntity | null> {
        try {
            const relation = await SequelizeUserCompany.findOne({
                where: { usrcmp_uuid: usrcmp_uuid ?? null },
                include: [{ model: SequelizeCompany, as: 'company' }]
            });
            if (!relation) {
                throw new Error(`No se encontró la relación usuario-empresa con Id: ${usrcmp_uuid}`);
            }
            return relation.dataValues;
        } catch (error: any) {
            console.error('Error en findUserCompanyById:', error.message);
            throw error;
        }
    }

    async createUserCompany(usercompany: UserCompanyEntity): Promise<UserCompanyEntity | null> {
        try {
            const created = await SequelizeUserCompany.create(usercompany as any);
            return created.dataValues;
        } catch (error: any) {
            console.error('Error en createUserCompany:', error.message);
            throw error;
        }
    }

    async updateUserCompany(usrcmp_uuid: string, updateData: UserCompanyUpdateData): Promise<UserCompanyEntity | null> {
        try {
            const [updatedRows] = await SequelizeUserCompany.update(updateData, {
                where: { usrcmp_uuid }
            });
            if (updatedRows === 0) {
                throw new Error(`No se pudo actualizar la relación con Id: ${usrcmp_uuid}`);
            }
            const updated = await SequelizeUserCompany.findByPk(usrcmp_uuid);
            return updated ? updated.dataValues : null;
        } catch (error: any) {
            console.error('Error en updateUserCompany:', error.message);
            throw error;
        }
    }

    async deleteUserCompany(usrcmp_uuid: string): Promise<UserCompanyEntity | null> {
        try {
            const relation = await SequelizeUserCompany.findByPk(usrcmp_uuid);
            if (!relation) {
                throw new Error(`No se encontró la relación con Id: ${usrcmp_uuid}`);
            }
            await SequelizeUserCompany.destroy({
                where: { usrcmp_uuid }
            });
            return relation.dataValues;
        } catch (error: any) {
            console.error('Error en deleteUserCompany:', error.message);
            throw error;
        }
    }

    async findUserCompaniesByUserId(usr_uuid: string): Promise<UserCompanyEntity[] | null> {
        try {
            const relations = await SequelizeUserCompany.findAll({
                where: { usr_uuid },
                include: [{ model: SequelizeCompany, as: 'company' }]
            });
            return relations;
        } catch (error: any) {
            console.error('Error en findUserCompaniesByUserId:', error.message);
            throw error;
        }
    }
}
