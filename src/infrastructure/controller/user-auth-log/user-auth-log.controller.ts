import { Request, Response } from "express";
import { UserAuthLogUseCase } from "../../../application/user-auth-log/user-auth-log-use-case";
import { paginator } from "../../services/paginator.service";

export class UserAuthLogController {
    constructor(private userAuthLogUseCase: UserAuthLogUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getByUserCtrl = this.getByUserCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const logs = await this.userAuthLogUseCase.getUserAuthLogs();
            const pageStr = req.query.page as string;
            const perPageStr = req.query.perPage as string;
            
            if (pageStr && perPageStr) {
                return res.status(200).send({
                    success: true,
                    message: 'Logs de auditoría retornados.',
                    ...paginator(logs || [], pageStr, perPageStr)
                });
            }

            return res.status(200).send({
                success: true,
                message: 'Logs de auditoría retornados.',
                data: logs
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (UserAuthLogController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar los logs de auditoría.',
                error: error.message,
            });
        }
    }

    public async getByUserCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const logs = await this.userAuthLogUseCase.getUserAuthLogs(usr_uuid);
            return res.status(200).send({
                success: true,
                message: 'Logs de auditoría del usuario retornados.',
                data: logs
            });
        } catch (error: any) {
            console.error('Error en getByUserCtrl (UserAuthLogController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar los logs de auditoría.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const usraulo_uuid = req.params.usraulo_uuid;
            if (!usraulo_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el log de auditoría.',
                    error: 'Debe proporcionar un Id de log.'
                });
            }
            const log = await this.userAuthLogUseCase.getDetailUserAuthLog('', usraulo_uuid);
            return res.status(200).send({
                success: true,
                message: 'Log de auditoría retornado.',
                data: log
            });
        } catch (error: any) {
            console.error('Error en getCtrl (UserAuthLogController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el log de auditoría.',
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: Request, res: Response) {
        try {
            const { usr_uuid, app_uuid, usraulo_action } = req.body;
            if (!usr_uuid || !app_uuid || !usraulo_action) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo registrar la auditoría.',
                    error: 'Debe proporcionar usr_uuid, app_uuid y usraulo_action.'
                });
            }
            const log = await this.userAuthLogUseCase.saveUserAuthLog(req.body);
            return res.status(200).json({
                success: true,
                message: 'Log de auditoría registrado.',
                data: log
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (UserAuthLogController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar la auditoría.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const usraulo_uuid = req.params.usraulo_uuid;
            const update = req.body;
            const log = await this.userAuthLogUseCase.updateUserAuthLog('', usraulo_uuid, update);
            return res.status(200).json({
                success: true,
                message: 'Log de auditoría actualizado.',
                data: log
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (UserAuthLogController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el log de auditoría.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const usraulo_uuid = req.params.usraulo_uuid;
            const log = await this.userAuthLogUseCase.deleteUserAuthLog('', usraulo_uuid);
            return res.status(200).json({
                success: true,
                message: 'Log de auditoría eliminado.',
                data: log
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (UserAuthLogController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el log de auditoría.',
                error: error.message,
            });
        }
    }
}
