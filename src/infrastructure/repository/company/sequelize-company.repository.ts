import { CompanyEntity, CompanyUpdateData } from "../../../domain/company/company.entity";
import { CompanyRepository } from "../../../domain/company/company.repository";
import { SequelizeCompany } from "../../model/company/company.model";
import { Op } from 'sequelize';

import { SequelizeUserCompany } from '../../model/user-company/user-company.model';
import { v4 as uuidv4 } from 'uuid';

export class SequelizeCompanyRepository implements CompanyRepository {
    async getCompanies(): Promise<CompanyEntity[] | null> {
        try {
            const companies = await SequelizeCompany.findAll();
            return companies;
        } catch (error: any) {
            console.error('Error en getCompanies:', error.message);
            throw error;
        }
    }

    async findCompanyById(cmp_uuid: string): Promise<CompanyEntity | null> {
        try {
            const company = await SequelizeCompany.findOne({
                where: { cmp_uuid: cmp_uuid ?? null }
            });
            if (!company) {
                throw new Error(`No se encontró la empresa con Id: ${cmp_uuid}`);
            }
            return company.dataValues;
        } catch (error: any) {
            console.error('Error en findCompanyById:', error.message);
            throw error;
        }
    }

    async createCompany(company: CompanyEntity): Promise<CompanyEntity | null> {
        try {
            const created = await SequelizeCompany.create(company as any);
            const creatorUserUuid = (company as any).usr_uuid;

            if (creatorUserUuid && created.cmp_uuid) {
                await SequelizeUserCompany.create({
                    usrcmp_uuid: uuidv4(),
                    usr_uuid: creatorUserUuid,
                    cmp_uuid: created.cmp_uuid,
                    usrcmp_role: 'OWNER',
                    usrcmp_active: true
                } as any);
            }

            return created.dataValues;
        } catch (error: any) {
            console.error('Error en createCompany:', error.message);
            throw error;
        }
    }

    async updateCompany(cmp_uuid: string, companyData: CompanyUpdateData): Promise<CompanyEntity | null> {
        try {
            const [updatedRows] = await SequelizeCompany.update(companyData, {
                where: { cmp_uuid }
            });
            if (updatedRows === 0) {
                throw new Error(`No se pudo actualizar la empresa con Id: ${cmp_uuid}`);
            }
            const updatedCompany = await SequelizeCompany.findByPk(cmp_uuid);
            return updatedCompany ? updatedCompany.dataValues : null;
        } catch (error: any) {
            console.error('Error en updateCompany:', error.message);
            throw error;
        }
    }

    async deleteCompany(cmp_uuid: string): Promise<CompanyEntity | null> {
        try {
            const company = await SequelizeCompany.findByPk(cmp_uuid);
            if (!company) {
                throw new Error(`No se encontró la empresa con Id: ${cmp_uuid}`);
            }
            await SequelizeCompany.destroy({
                where: { cmp_uuid }
            });
            return company.dataValues;
        } catch (error: any) {
            console.error('Error en deleteCompany:', error.message);
            throw error;
        }
    }

    async findCompanyByName(cmp_cod: string, cmp_name: string): Promise<CompanyEntity | null> {
        try {
            const company = await SequelizeCompany.findOne({
                where: {
                    [Op.or]: [
                        { cmp_cod: cmp_cod ?? null },
                        { cmp_name: cmp_name ?? null }
                    ]
                }
            });
            return company ? company.dataValues : null;
        } catch (error: any) {
            console.error('Error en findCompanyByName:', error.message);
            throw error;
        }
    }
}
