import { ApplicationUpdateEntity } from "./application-update.entity";

export interface ApplicationUpdateRepository {
    listUpdates(app_uuid: string): Promise<ApplicationUpdateEntity[]>;
    createUpdate(update: ApplicationUpdateEntity): Promise<ApplicationUpdateEntity>;
}
