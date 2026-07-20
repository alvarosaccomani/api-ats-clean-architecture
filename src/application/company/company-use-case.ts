import { CompanyRepository } from "../../domain/company/company.repository";
import { CompanyEntity, CompanyUpdateData } from "../../domain/company/company.entity";
import { CompanyValue } from "../../domain/company/company.value";

export class CompanyUseCase {
    constructor(private readonly companyRepository: CompanyRepository) {}

    public async getCompanies(): Promise<CompanyEntity[] | null> {
        const companies = await this.companyRepository.getCompanies();
        return companies;
    }

    public async getDetailCompany(cmp_uuid: string): Promise<CompanyEntity | null> {
        const company = await this.companyRepository.findCompanyById(cmp_uuid);
        return company;
    }

    public async saveCompany(companyData: {
        cmp_cod: string;
        cmp_name: string;
        cmp_cuit: string;
        cmp_address: string;
        cmp_phone: string;
        cmp_email: string;
        cmp_description: string;
        cmp_image: string;
        cmp_active: boolean;
    }): Promise<CompanyEntity | null> {
        const companyValue = new CompanyValue(companyData);
        const companyCreated = await this.companyRepository.createCompany(companyValue);
        return companyCreated;
    }

    public async updateCompany(cmp_uuid: string, updateData: CompanyUpdateData): Promise<CompanyEntity | null> {
        const companyUpdated = await this.companyRepository.updateCompany(cmp_uuid, updateData);
        return companyUpdated;
    }

    public async deleteCompany(cmp_uuid: string): Promise<CompanyEntity | null> {
        const companyDeleted = await this.companyRepository.deleteCompany(cmp_uuid);
        return companyDeleted;
    }
}
