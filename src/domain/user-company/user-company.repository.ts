import { UserCompanyEntity, UserCompanyUpdateData } from "./user-company.entity";

export interface UserCompanyRepository {
    getUserCompanies(): Promise<UserCompanyEntity[] | null>;
    findUserCompanyById(usrcmp_uuid: string): Promise<UserCompanyEntity | null>;
    createUserCompany(usercompany: UserCompanyEntity): Promise<UserCompanyEntity | null>;
    updateUserCompany(usrcmp_uuid: string, usercompany: UserCompanyUpdateData): Promise<UserCompanyEntity | null>;
    deleteUserCompany(usrcmp_uuid: string): Promise<UserCompanyEntity | null>;
}