import { CompanyEntity, CompanyUpdateData } from "./company.entity";

export interface CompanyRepository {
    getCompanies(): Promise<CompanyEntity[] | null>;
    findCompanyById(cmp_uuid: string): Promise<CompanyEntity | null>;
    createCompany(company: CompanyEntity): Promise<CompanyEntity | null>;
    updateCompany(cmp_uuid: string, company: CompanyUpdateData): Promise<CompanyEntity | null>;
    deleteCompany(cmp_uuid: string): Promise<CompanyEntity | null>;
    findCompanyByName(cmp_code: string, cmp_name: string): Promise<CompanyEntity | null>;
}