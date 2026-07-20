import { ApplicationEntity, ApplicationUpdateData } from "./application.entity";

export interface ApplicationRepository {
    getApplications(): Promise<ApplicationEntity[] | null>;
    findApplicationById(app_uuid: string): Promise<ApplicationEntity | null>;
    createApplication(application: ApplicationEntity): Promise<ApplicationEntity | null>;
    updateApplication(app_uuid: string, application: ApplicationUpdateData): Promise<ApplicationEntity | null>;
    deleteApplication(app_uuid: string): Promise<ApplicationEntity | null>;
    findApplicationByName(app_code: string, app_name: string): Promise<ApplicationEntity | null>;
}