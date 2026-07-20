import { TypeApplicationRepository } from "../../domain/type-application/type-application.repository";
import { TypeApplicationEntity, TypeApplicationUpdateData } from "../../domain/type-application/type-application.entity";
import { TypeApplicationValue } from "../../domain/type-application/type-application.value";

export class TypeApplicationUseCase {
    constructor(private readonly typeApplicationRepository: TypeApplicationRepository) {}

    public async getTypeApplications(): Promise<TypeApplicationEntity[] | null> {
        const typeApplications = await this.typeApplicationRepository.getTypeApplications();
        return typeApplications;
    }

    public async getDetailTypeApplication(tapp_uuid: string): Promise<TypeApplicationEntity | null> {
        const typeApplication = await this.typeApplicationRepository.findTypeApplicationById(tapp_uuid);
        return typeApplication;
    }

    public async saveTypeApplication(typeAppData: {
        tapp_cod: string;
        tapp_name: string;
        tapp_description: string;
        tapp_bkcolor: string;
        tapp_frcolor: string;
        tapp_active: boolean;
    }): Promise<TypeApplicationEntity | null> {
        const typeAppValue = new TypeApplicationValue(typeAppData);
        const typeAppCreated = await this.typeApplicationRepository.createTypeApplication(typeAppValue);
        return typeAppCreated;
    }

    public async updateTypeApplication(tapp_uuid: string, updateData: TypeApplicationUpdateData): Promise<TypeApplicationEntity | null> {
        const typeAppUpdated = await this.typeApplicationRepository.updateTypeApplication(tapp_uuid, updateData);
        return typeAppUpdated;
    }

    public async deleteTypeApplication(tapp_uuid: string): Promise<TypeApplicationEntity | null> {
        const typeAppDeleted = await this.typeApplicationRepository.deleteTypeApplication(tapp_uuid);
        return typeAppDeleted;
    }
}
