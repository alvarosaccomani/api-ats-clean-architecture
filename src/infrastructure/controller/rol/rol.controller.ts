import { Request, Response } from "express";
import { SequelizeRol } from "../../model/rol/rol.model";

export class RolController {
    public async getAllCtrl(req: Request, res: Response) {
        try {
            const roles = await SequelizeRol.findAll({
                order: [['rol_name', 'ASC']]
            });
            return res.status(200).json({
                success: true,
                message: 'Roles retornados.',
                data: roles
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (RolController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar los roles.',
                error: error.message
            });
        }
    }
}
