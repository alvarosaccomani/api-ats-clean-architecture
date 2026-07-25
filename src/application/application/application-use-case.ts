import { ApplicationRepository } from "../../domain/application/application.repository";
import { ApplicationEntity, ApplicationUpdateData } from "../../domain/application/application.entity";
import { ApplicationValue } from "../../domain/application/application.value";

export class ApplicationUseCase {
    constructor(private readonly applicationRepository: ApplicationRepository) {}

    public async getApplications(): Promise<ApplicationEntity[] | null> {
        const applications = await this.applicationRepository.getApplications();
        return applications;
    }

    public async getDetailApplication(app_uuid: string): Promise<ApplicationEntity | null> {
        const application = await this.applicationRepository.findApplicationById(app_uuid);
        return application;
    }

    public async saveApplication(applicationData: {
        app_cod: string;
        app_name: string;
        tapp_uuid: string;
        app_description: string;
        app_dbname: string;
        app_url: string;
        app_hasaccess: boolean;
        app_active: boolean;
        app_loginmode: string;
    }): Promise<ApplicationEntity | null> {
        const applicationValue = new ApplicationValue(applicationData);
        const applicationCreated = await this.applicationRepository.createApplication(applicationValue);
        return applicationCreated;
    }

    public async updateApplication(app_uuid: string, updateData: ApplicationUpdateData): Promise<ApplicationEntity | null> {
        const applicationUpdated = await this.applicationRepository.updateApplication(app_uuid, updateData);
        return applicationUpdated;
    }

    public async deleteApplication(app_uuid: string): Promise<ApplicationEntity | null> {
        const applicationDeleted = await this.applicationRepository.deleteApplication(app_uuid);
        return applicationDeleted;
    }
}
