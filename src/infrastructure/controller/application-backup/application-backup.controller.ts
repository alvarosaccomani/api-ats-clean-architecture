import { Request, Response } from "express";
import { ApplicationBackupUseCase } from "../../../application/application-backup/application-backup-use-case";
import { ApplicationBackupValue } from "../../../domain/application-backup/application-backup.value";

export class AppBackupController {
    constructor(private readonly backupUseCase: ApplicationBackupUseCase) {}

    public getBackupsCtrl = async (req: Request, res: Response) => {
        try {
            const { app_uuid } = req.params;
            const backups = await this.backupUseCase.getBackups(app_uuid);

            return res.status(200).json({
                success: true,
                message: 'Copias de seguridad recuperadas con éxito.',
                data: backups
            });
        } catch (error: any) {
            console.error('Error en getBackupsCtrl:', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las copias de seguridad.',
                error: error.message
            });
        }
    }

    public createBackupCtrl = async (req: any, res: Response) => {
        try {
            const { app_uuid } = req.params;
            const { appbak_filename, appbak_size, appbak_status, appbak_storagepath } = req.body;
            const usr_uuid = req.user?.sub || req.user?.usr_uuid || null;

            if (!appbak_filename || appbak_size === undefined || !appbak_status) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan datos obligatorios.',
                    error: 'Se requiere nombre de archivo, tamaño y estado.'
                });
            }

            const backupValue = new ApplicationBackupValue({
                app_uuid,
                usr_uuid,
                appbak_filename,
                appbak_size: Number(appbak_size),
                appbak_status,
                appbak_storagepath: appbak_storagepath || ''
            });

            const created = await this.backupUseCase.registerBackup(backupValue);

            return res.status(201).json({
                success: true,
                message: 'Copia de seguridad registrada con éxito.',
                data: created
            });
        } catch (error: any) {
            console.error('Error en createBackupCtrl:', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar la copia de seguridad.',
                error: error.message
            });
        }
    }
}
