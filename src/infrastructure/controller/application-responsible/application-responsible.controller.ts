import { Request, Response } from "express";
import { SequelizeAppResponsible } from "../../model/application-responsible/application-responsible.model";
import { SequelizeUser } from "../../model/user/user.model";
import { SequelizeRol } from "../../model/rol/rol.model";
import { AppResponsibleValue } from "../../../domain/application-responsible/application-responsible.value";

export class AppResponsibleController {
    public async getResponsiblesCtrl(req: Request, res: Response) {
        try {
            const { app_uuid } = req.params;
            const responsibles = await SequelizeAppResponsible.findAll({
                where: { app_uuid },
                include: [
                    { 
                        model: SequelizeUser, 
                        as: 'user', 
                        attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email', 'usr_nick', 'usr_image'] 
                    },
                    { 
                        model: SequelizeRol, 
                        as: 'rol', 
                        attributes: ['rol_uuid', 'rol_name'] 
                    }
                ],
                order: [['appres_createdat', 'ASC']]
            });

            return res.status(200).json({
                success: true,
                message: 'Responsables recuperados con éxito.',
                data: responsibles
            });
        } catch (error: any) {
            console.error('Error en getResponsiblesCtrl:', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar los responsables de la aplicación.',
                error: error.message
            });
        }
    }

    public async assignResponsibleCtrl(req: Request, res: Response) {
        try {
            const { app_uuid } = req.params;
            const { usr_uuid, rol_uuid } = req.body;

            if (!usr_uuid || !rol_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan datos obligatorios.',
                    error: 'Se requiere usr_uuid y rol_uuid.'
                });
            }

            // Validar si ya está asignado
            const existing = await SequelizeAppResponsible.findOne({
                where: { app_uuid, usr_uuid }
            });

            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'El usuario ya está asignado como responsable de esta aplicación.'
                });
            }

            const responsibleObj = new AppResponsibleValue({
                app_uuid,
                usr_uuid,
                rol_uuid
            });

            const created = await SequelizeAppResponsible.create(responsibleObj as any);

            // Devolver el registro completo con eager load de relaciones para el frontend
            const fullRecord = await SequelizeAppResponsible.findByPk(created.appres_uuid, {
                include: [
                    { 
                        model: SequelizeUser, 
                        as: 'user', 
                        attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email', 'usr_nick', 'usr_image'] 
                    },
                    { 
                        model: SequelizeRol, 
                        as: 'rol', 
                        attributes: ['rol_uuid', 'rol_name'] 
                    }
                ]
            });

            return res.status(201).json({
                success: true,
                message: 'Responsable asignado con éxito.',
                data: fullRecord
            });
        } catch (error: any) {
            console.error('Error en assignResponsibleCtrl:', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo asignar el responsable.',
                error: error.message
            });
        }
    }

    public async removeResponsibleCtrl(req: Request, res: Response) {
        try {
            const { appres_uuid } = req.params;

            const deleted = await SequelizeAppResponsible.destroy({
                where: { appres_uuid }
            });

            if (deleted === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró la asignación de responsable.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Responsable desvinculado con éxito.'
            });
        } catch (error: any) {
            console.error('Error en removeResponsibleCtrl:', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo desvincular el responsable.',
                error: error.message
            });
        }
    }
}
