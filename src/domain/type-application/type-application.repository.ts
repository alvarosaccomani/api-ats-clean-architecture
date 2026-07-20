import { TypeApplicationEntity, TypeApplicationUpdateData } from "./type-application.entity";

export interface TypeApplicationRepository {
    getTypeApplications(): Promise<TypeApplicationEntity[] | null>;
    findTypeApplicationById(tapp_uuid: string): Promise<TypeApplicationEntity | null>;
    createTypeApplication(typeApplication: TypeApplicationEntity): Promise<TypeApplicationEntity | null>;
    updateTypeApplication(tapp_uuid: string, typeApplication: TypeApplicationUpdateData): Promise<TypeApplicationEntity | null>;
    deleteTypeApplication(tapp_uuid: string): Promise<TypeApplicationEntity | null>;
    findTypeApplicationByName(tapp_code: string, tapp_name: string): Promise<TypeApplicationEntity | null>;
}