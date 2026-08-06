import { ApplicationUpdateRepository } from "../../domain/application-update/application-update.repository";
import { ApplicationUpdateEntity } from "../../domain/application-update/application-update.entity";

export class ApplicationUpdateUseCase {
    constructor(private readonly updateRepository: ApplicationUpdateRepository) {}

    public async getUpdates(app_uuid: string): Promise<ApplicationUpdateEntity[]> {
        return this.updateRepository.listUpdates(app_uuid);
    }

    public async registerUpdate(update: ApplicationUpdateEntity): Promise<ApplicationUpdateEntity> {
        return this.updateRepository.createUpdate(update);
    }
}
