import { Request, Response } from "express";
import { UserSessionUseCase } from "../../../application/user-session/user-session-use-case";

export class UserSessionController {
    constructor(private userSessionUseCase: UserSessionUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getByUserCtrl = this.getByUserCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = (req as any).user?.usr_uuid || '';
            const sessions = await this.userSessionUseCase.getUserSessions(usr_uuid);
            return res.status(200).send({
                success: true,
                message: 'Sesiones retornadas.',
                data: sessions
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (UserSessionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las sesiones.',
                error: error.message,
            });
        }
    }

    public async getByUserCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const sessions = await this.userSessionUseCase.getUserSessions(usr_uuid);
            return res.status(200).send({
                success: true,
                message: 'Sesiones del usuario retornadas.',
                data: sessions
            });
        } catch (error: any) {
            console.error('Error en getByUserCtrl (UserSessionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las sesiones.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const usrs_uuid = req.params.usrs_uuid;
            const session = await this.userSessionUseCase.getDetailUserSession('', usrs_uuid);
            return res.status(200).send({
                success: true,
                message: 'Sesión retornada.',
                data: session
            });
        } catch (error: any) {
            console.error('Error en getCtrl (UserSessionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar la sesión.',
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: Request, res: Response) {
        try {
            const { usr_uuid, usrs_refreshtoken } = req.body;
            if (!usr_uuid || !usrs_refreshtoken) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo registrar la sesión.',
                    error: 'Debe proporcionar usr_uuid y usrs_refreshtoken.'
                });
            }
            const session = await this.userSessionUseCase.saveUserSession(req.body);
            return res.status(200).json({
                success: true,
                message: 'Sesión registrada.',
                data: session
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (UserSessionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar la sesión.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const usrs_uuid = req.params.usrs_uuid;
            const update = req.body;
            const session = await this.userSessionUseCase.updateUserSession('', usrs_uuid, update);
            return res.status(200).json({
                success: true,
                message: 'Sesión actualizada.',
                data: session
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (UserSessionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la sesión.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const usrs_uuid = req.params.usrs_uuid;
            const session = await this.userSessionUseCase.deleteUserSession('', usrs_uuid);
            return res.status(200).json({
                success: true,
                message: 'Sesión cerrada/eliminada.',
                data: session
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (UserSessionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la sesión.',
                error: error.message,
            });
        }
    }
}
