import { Request, Response } from "express";
import { UserUseCase } from "../../../application/user/user-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";

export class UserController {
    constructor(private userUseCase: UserUseCase, private socketAdapter: SocketAdapter) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const page = (req.params.page ? parseInt(req.params.page) : null);
            const perPage = (req.params.perPage ? parseInt(req.params.perPage) : null);
            if (page && perPage) {
                const users = await this.userUseCase.getUsers();
                return res.status(200).send({
                    success: true,
                    message: 'Usuarios retornados.',
                    ...paginator(users, page.toString(), perPage.toString())
                });
            } else {
                const users = await this.userUseCase.getUsers();
                return res.status(200).send({
                    success: true,
                    message: 'Usuarios retornados.',
                    data: users
                });
            }
        } catch (error: any) {
            console.error('Error en getAllCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar los usuarios.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            if(!usr_uuid || usr_uuid.toLowerCase() === 'null' || usr_uuid.toLowerCase() === 'undefined') {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar el usuario.',
                    error: 'Debe proporcionar un Id de usuario.'
                });
            }
            const user = await this.userUseCase.getDetailUser(`${usr_uuid}`);
            return res.status(200).send({
                success: true,
                message: 'Usuario retornado.',
                data: user
            });
        } catch (error: any) {
            console.error('Error en getCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar el usuario.',
                error: error.message,
            });
        }
    }

    public async saveCtrl({ body }: Request, res: Response) {
        try {
            const usr_nick = body.usr_nick;
            const usr_email = body.usr_email;        
            if(!usr_nick) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el usuario.',
                    error: 'Debe proporcionar un Nick para el usuario.'
                });
            }
            if(!usr_email) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el usuario.',
                    error: 'Debe proporcionar un Email para el usuario.'
                });
            }
            const userExist = await this.userUseCase.userExist(usr_nick, usr_email);
            if(userExist) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo insertar el usuario.',
                    error: 'El usuario ya existe.'
                });
            }
            const user = await this.userUseCase.saveUser(body);
            this.socketAdapter.emitEvent('user_created', { user });
            return res.status(200).json({
                success: true,
                message: 'Usuario insertado.',
                data: user
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo insertar el usuario.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            const update = req.body;
            if(!update.usr_nick) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el usuario.',
                    error: 'Debe proporcionar un Nick para el usuario.'
                });
            }
            if(!update.usr_email) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar el usuario.',
                    error: 'Debe proporcionar un Email para el usuario.'
                });
            }
            const user = await this.userUseCase.updateUser(usr_uuid, update);
            return res.status(200).json({
                success: true,
                message: 'Usuario actualizado.',
                data: user
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar el usuario.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const usr_uuid = req.params.usr_uuid;
            if(!usr_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar el usuario.',
                    error: 'Debe proporcionar un Id de usuario.'
                });
            }
            const user = await this.userUseCase.deleteUser(usr_uuid);
            this.socketAdapter.emitEvent('user_deleted', { usr_uuid });
            return res.status(200).json({
                success: true,
                message: 'Usuario eliminado.',
                data: user
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (controller):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar el usuario.',
                error: error.message,
            });
        }
    }
}