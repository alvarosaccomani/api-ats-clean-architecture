import { UserCompanyRepository } from "../../domain/user-company/user-company.repository";
import { UserCompanyEntity, UserCompanyUpdateData } from "../../domain/user-company/user-company.entity";
import { UserCompanyValue } from "../../domain/user-company/user-company.value";
import { SequelizeUserCompanyRepository } from "../../infrastructure/repository/user-company/sequelize-user-company.repository";

export class UserCompanyUseCase {
    constructor(private readonly userCompanyRepository: UserCompanyRepository) {}

    public async getUserCompanies(): Promise<UserCompanyEntity[] | null> {
        const relations = await this.userCompanyRepository.getUserCompanies();
        return relations;
    }

    public async getDetailUserCompany(usrcmp_uuid: string): Promise<UserCompanyEntity | null> {
        const relation = await this.userCompanyRepository.findUserCompanyById(usrcmp_uuid);
        return relation;
    }

    public async getUserCompaniesByUserId(usr_uuid: string): Promise<UserCompanyEntity[] | null> {
        if (this.userCompanyRepository instanceof SequelizeUserCompanyRepository) {
            return await this.userCompanyRepository.findUserCompaniesByUserId(usr_uuid);
        }
        return await this.userCompanyRepository.getUserCompanies();
    }

    public async saveUserCompany(data: {
        usr_uuid: string;
        cmp_uuid: string;
        usrcmp_role: string;
        usrcmp_active: boolean;
    }): Promise<UserCompanyEntity | null> {
        const valueObj = new UserCompanyValue(data);
        const created = await this.userCompanyRepository.createUserCompany(valueObj);
        return created;
    }

    public async updateUserCompany(usrcmp_uuid: string, updateData: UserCompanyUpdateData): Promise<UserCompanyEntity | null> {
        const updated = await this.userCompanyRepository.updateUserCompany(usrcmp_uuid, updateData);
        return updated;
    }

    public async deleteUserCompany(usrcmp_uuid: string): Promise<UserCompanyEntity | null> {
        const deleted = await this.userCompanyRepository.deleteUserCompany(usrcmp_uuid);
        return deleted;
    }
}
