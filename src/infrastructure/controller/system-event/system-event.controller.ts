import { Request, Response } from "express";
import { SystemEventUseCase } from "../../../application/system-event/system-event-use-case";

export class SystemEventController {
    constructor(private systemEventUseCase: SystemEventUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const logs = await this.systemEventUseCase.getEvents();
            return res.status(200).send({
                success: true,
                message: 'Eventos de auditoría de sistema retornados.',
                data: logs
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (SystemEventController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar los eventos de auditoría de sistema.',
                error: error.message,
            });
        }
    }
}
