import { Request, Response } from "express";
import { UserUseCase } from "../../../application/user/user-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";
import { SystemEventLogger } from "../../services/system-event-logger.service";
import { SequelizeApplication } from "../../model/application/application.model";
import { SequelizeApplicationSetting } from "../../model/application-setting/application-setting.model";

export class UserController {
    constructor(private userUseCase: UserUseCase, private socketAdapter: SocketAdapter) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
        this.getRemoteSatelliteUsersCtrl = this.getRemoteSatelliteUsersCtrl.bind(this);
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

    public async saveCtrl(req: Request, res: Response) {
        try {
            const body = req.body;
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
            
            // Registrar evento
            await SystemEventLogger.log(req, 'USER_CREATED', 'User', user.usr_uuid, {
                usr_name: user.usr_name,
                usr_surname: user.usr_surname,
                usr_email: user.usr_email
            });

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
            
            // Registrar evento
            await SystemEventLogger.log(req, 'USER_UPDATED', 'User', user.usr_uuid, {
                usr_name: user.usr_name,
                usr_surname: user.usr_surname,
                usr_email: user.usr_email
            });

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
            
            // Registrar evento
            await SystemEventLogger.log(req, 'USER_DELETED', 'User', usr_uuid, {
                usr_name: user.usr_name,
                usr_surname: user.usr_surname,
                usr_email: user.usr_email
            });

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

    public async getRemoteSatelliteUsersCtrl(req: Request, res: Response) {
        try {
            const app_uuid = req.params.app_uuid;
            const appRecord = await SequelizeApplication.findByPk(app_uuid);
            if (!appRecord) {
                return res.status(404).json({
                    success: false,
                    message: 'Aplicación no encontrada.'
                });
            }

            const appSettings = await SequelizeApplicationSetting.findAll({
                where: { app_uuid }
            });

            let apiDomain = '';
            let apiPort = '';
            let explicitApiUrl = '';

            for (const s of appSettings) {
                const key = (s.apps_key || s.apps_parameter || '').toLowerCase().trim();
                const val = (s.apps_value || '').trim();
                if (key === 'api_domain') apiDomain = val;
                if (key === 'api_port') apiPort = val;
                if (key === 'api_url' || key === 'backend_url') explicitApiUrl = val;
            }

            let apiBaseUrl = '';
            if (explicitApiUrl) {
                apiBaseUrl = explicitApiUrl.replace(/\/+$/, '');
            } else if (apiDomain) {
                let domain = apiDomain.replace(/\/+$/, '');
                if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
                    domain = `http://${domain}`;
                }
                if (apiPort && !domain.includes(':', 6)) {
                    apiBaseUrl = `${domain}:${apiPort}`;
                } else {
                    apiBaseUrl = domain;
                }
            } else if (appRecord.app_url) {
                apiBaseUrl = appRecord.app_url.replace(/\/+$/, '');
            }

            if (!apiBaseUrl) {
                return res.status(200).json({
                    success: false,
                    message: `La aplicación "${appRecord.app_name}" no tiene configurada la URL de su API (configurar api_domain y api_port, o api_url en settings).`,
                    data: []
                });
            }

            const endpointsToTry: string[] = [];
            if (apiBaseUrl.endsWith('/api')) {
                endpointsToTry.push(`${apiBaseUrl}/users`);
            } else {
                endpointsToTry.push(`${apiBaseUrl}/api/users`);
                endpointsToTry.push(`${apiBaseUrl}/users`);
            }

            let remoteUsers: any[] = [];
            let fetchSuccessful = false;
            let lastErrorMessage = '';

            if (typeof fetch !== 'undefined') {
                for (const url of endpointsToTry) {
                    try {
                        console.log(`[RemoteUsers] Consultando API satélite en: ${url}`);
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 4000);
                        const response = await fetch(url, { signal: controller.signal });
                        clearTimeout(timeoutId);

                        if (response.ok) {
                            fetchSuccessful = true;
                            const json: any = await response.json();
                            const items = Array.isArray(json) 
                                ? json 
                                : (Array.isArray(json?.data) ? json.data : (Array.isArray(json?.users) ? json.users : []));

                            console.log(`[RemoteUsers] ¡Éxito! Se obtuvieron ${items.length} usuarios desde: ${url}`);
                            remoteUsers = items;
                            break;
                        } else {
                            lastErrorMessage = `HTTP ${response.status} en ${url}`;
                            console.warn(`[RemoteUsers] ${url} respondió HTTP ${response.status}`);
                        }
                    } catch (err: any) {
                        lastErrorMessage = err.message;
                        console.warn(`[RemoteUsers] Error al consultar ${url}:`, err.message);
                    }
                }
            }

            if (!fetchSuccessful) {
                return res.status(200).json({
                    success: false,
                    message: `No se pudo conectar con la API de "${appRecord.app_name}" en ${apiBaseUrl} (${lastErrorMessage || 'sin respuesta'}). Verificá que el servicio esté activo y el puerto/ruta sean correctos.`,
                    data: []
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Usuarios remotos recuperados.',
                data: remoteUsers
            });
        } catch (error: any) {
            console.error('Error en getRemoteSatelliteUsersCtrl:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Error al consultar usuarios remotos.',
                error: error.message
            });
        }
    }
}