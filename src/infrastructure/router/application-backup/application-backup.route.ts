import { Express } from "express";
import { AppBackupController } from "../../controller/application-backup/application-backup.controller";
import { SequelizeApplicationBackupRepository } from "../../repository/application-backup/sequelize-application-backup.repository";
import { ApplicationBackupUseCase } from "../../../application/application-backup/application-backup-use-case";
import { ensureSysAdmin } from "../../middleware/auth.middleware";

function configureAppBackupRoutes(app: Express, socketAdapter?: any) {
    const repository = new SequelizeApplicationBackupRepository();
    const useCase = new ApplicationBackupUseCase(repository);
    const controller = new AppBackupController(useCase);

    app.get(`/${process.env.BASE_URL_API}/application/:app_uuid/backups`, ensureSysAdmin, controller.getBackupsCtrl);
    app.post(`/${process.env.BASE_URL_API}/application/:app_uuid/backups`, ensureSysAdmin, controller.createBackupCtrl);
}

export default configureAppBackupRoutes;
