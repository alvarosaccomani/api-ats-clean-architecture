import { Request, Response } from "express";
import { UserUseCase } from "../../../application/user/user-use-case";
import SocketAdapter from "../../services/socketAdapter";
import { paginator } from "../../services/paginator.service";
import { SystemEventLogger } from "../../services/system-event-logger.service";
import { SequelizeApplication } from "../../model/application/application.model";
import { SequelizeApplicationSetting } from "../../model/application-setting/application-setting.model";
import { SequelizeUser } from "../../model/user/user.model";
import { SequelizeSubscription } from "../../model/subscription/subscription.model";
import { SequelizeCompany } from "../../model/company/company.model";
import { SequelizePlan } from "../../model/plan/plan.model";
import { SequelizeTypeApplication } from "../../model/type-application/type-application.model";
import { SequelizeUserAuthLog } from "../../model/user-auth-log/user-auth-log.model";

export class UserController {
    constructor(private userUseCase: UserUseCase, private socketAdapter: SocketAdapter) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
        this.getRemoteSatelliteUsersCtrl = this.getRemoteSatelliteUsersCtrl.bind(this);
        this.getUsersSatellitesMatrixCtrl = this.getUsersSatellitesMatrixCtrl.bind(this);
        this.verifyUserSatellitesPresenceCtrl = this.verifyUserSatellitesPresenceCtrl.bind(this);
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

            const apiBaseUrl = this.resolveAppApiBaseUrl(appRecord, appSettings);

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

    /**
     * Resuelve de forma uniforme la URL base del API de un satélite a partir de sus configuraciones.
     */
    private resolveAppApiBaseUrl(appRecord: any, appSettings: any[]): string {
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

        if (explicitApiUrl) {
            return explicitApiUrl.replace(/\/+$/, '');
        } else if (apiDomain) {
            let domain = apiDomain.replace(/\/+$/, '');
            if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
                domain = `http://${domain}`;
            }
            if (apiPort && !domain.includes(':', 6)) {
                return `${domain}:${apiPort}`;
            } else {
                return domain;
            }
        } else if (appRecord?.app_url) {
            return appRecord.app_url.replace(/\/+$/, '');
        }
        return '';
    }

    /**
     * @description Genera la matriz consolidada de usuarios y satélites, determinando para cada usuario
     * su derecho comercial (suscrito en ATS Core directa o corporativamente) y su presencia/actividad SSO.
     */
    public async getUsersSatellitesMatrixCtrl(req: Request, res: Response) {
        try {
            // 1. Obtener aplicaciones satélites activas
            const applications = await SequelizeApplication.findAll({
                where: { app_active: true, app_hasaccess: true },
                include: [{ model: SequelizeTypeApplication, as: 'typeApplication' }],
                order: [['app_name', 'ASC']]
            });

            // 2. Obtener usuarios con sus suscripciones y empresas asociadas
            const users = await SequelizeUser.findAll({
                attributes: ['usr_uuid', 'usr_name', 'usr_surname', 'usr_email', 'usr_nick', 'usr_sysadmin', 'usr_confirmed', 'usr_online', 'usr_image', 'usr_createdat'],
                include: [
                    {
                        model: SequelizeSubscription,
                        as: 'subscriptions',
                        where: { sub_active: true },
                        required: false,
                        include: [{ model: SequelizePlan, as: 'plan' }]
                    },
                    {
                        model: SequelizeCompany,
                        as: 'companies',
                        attributes: ['cmp_uuid', 'cmp_name', 'cmp_cod'],
                        through: { attributes: [] },
                        required: false,
                        include: [
                            {
                                model: SequelizeSubscription,
                                as: 'subscriptions',
                                where: { sub_active: true },
                                required: false,
                                include: [{ model: SequelizePlan, as: 'plan' }]
                            }
                        ]
                    }
                ],
                order: [['usr_name', 'ASC']]
            });

            // 3. Bitácora de accesos SSO / logins
            const authLogs = await SequelizeUserAuthLog.findAll({
                attributes: ['usr_uuid', 'app_uuid', 'usraulo_action', 'usraulo_createdat'],
                order: [['usraulo_createdat', 'DESC']]
            });

            const userAuthMap = new Map<string, any>();
            for (const log of authLogs) {
                const key = `${log.usr_uuid}_${log.app_uuid}`;
                if (!userAuthMap.has(key)) {
                    userAuthMap.set(key, log);
                }
            }

            // 4. Mapear matriz de cada usuario cruzando todas las aplicaciones satélite
            const matrix = users.map((userInstance: any) => {
                const user = userInstance.toJSON();
                const isSysAdmin = !!user.usr_sysadmin;

                const satellites = applications.map((appInstance: any) => {
                    const app = appInstance.toJSON();
                    let isSubscribed = false;
                    let subAccessType: 'SYSADMIN' | 'USER' | 'COMPANY' | 'NONE' = 'NONE';
                    let planName: string | null = null;
                    let companyName: string | null = null;
                    let subStatus: string | null = null;
                    let renewsAt: string | null = null;

                    if (isSysAdmin) {
                        isSubscribed = true;
                        subAccessType = 'SYSADMIN';
                        planName = 'SysAdmin Global';
                        subStatus = 'ACTIVE';
                    } else {
                        // Suscripción directa personal
                        const directSub = user.subscriptions?.find((s: any) => s.app_uuid === app.app_uuid && s.sub_active);
                        if (directSub) {
                            isSubscribed = true;
                            subAccessType = 'USER';
                            planName = directSub.plan?.pla_name || 'Plan Personal';
                            subStatus = directSub.sub_status;
                            renewsAt = directSub.sub_renewsat;
                        } else {
                            // Suscripción vía empresas
                            for (const comp of user.companies || []) {
                                const compSub = comp.subscriptions?.find((s: any) => s.app_uuid === app.app_uuid && s.sub_active);
                                if (compSub) {
                                    isSubscribed = true;
                                    subAccessType = 'COMPANY';
                                    companyName = comp.cmp_name;
                                    planName = compSub.plan?.pla_name || 'Plan Empresa';
                                    subStatus = compSub.sub_status;
                                    renewsAt = compSub.sub_renewsat;
                                    break;
                                }
                            }
                        }
                    }

                    const userLog = userAuthMap.get(`${user.usr_uuid}_${app.app_uuid}`);
                    const hasSSOActivity = !!userLog;
                    const lastSSOAt = userLog?.usraulo_createdat || null;
                    const isCreatedInSatellite = hasSSOActivity; // JIT provisioned on first SSO

                    return {
                        app_uuid: app.app_uuid,
                        app_cod: app.app_cod,
                        app_name: app.app_name,
                        app_url: app.app_url,
                        app_type: app.typeApplication?.tapp_name || 'Core',
                        bkColor: app.typeApplication?.tapp_bkcolor || null,
                        frColor: app.typeApplication?.tapp_frcolor || null,
                        isSubscribed,
                        subAccessType,
                        planName,
                        companyName,
                        subStatus,
                        renewsAt,
                        hasSSOActivity,
                        lastSSOAt,
                        isCreatedInSatellite
                    };
                });

                return {
                    usr_uuid: user.usr_uuid,
                    usr_name: user.usr_name,
                    usr_surname: user.usr_surname,
                    usr_email: user.usr_email,
                    usr_nick: user.usr_nick,
                    usr_sysadmin: isSysAdmin,
                    usr_confirmed: !!user.usr_confirmed,
                    usr_online: !!user.usr_online,
                    usr_image: user.usr_image,
                    usr_createdat: user.usr_createdat,
                    companies: user.companies?.map((c: any) => ({ cmp_uuid: c.cmp_uuid, cmp_name: c.cmp_name, cmp_cod: c.cmp_cod })) || [],
                    satellites
                };
            });

            return res.status(200).json({
                success: true,
                message: 'Matriz de usuarios y satélites generada con éxito.',
                data: {
                    applications: applications.map((a: any) => ({
                        app_uuid: a.app_uuid,
                        app_cod: a.app_cod,
                        app_name: a.app_name,
                        app_type: a.typeApplication?.tapp_name || 'Core',
                        bkColor: a.typeApplication?.tapp_bkcolor || null,
                        frColor: a.typeApplication?.tapp_frcolor || null
                    })),
                    users: matrix
                }
            });
        } catch (error: any) {
            console.error('Error en getUsersSatellitesMatrixCtrl:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Error al generar la matriz de usuarios y satélites.',
                error: error.message
            });
        }
    }

    /**
     * @description Escanea en tiempo real las APIs de los satélites configurados para verificar si
     * el usuario con el UUID provisto existe físicamente en las tablas locales de las bases remotas.
     */
    public async verifyUserSatellitesPresenceCtrl(req: Request, res: Response) {
        try {
            const { usr_uuid } = req.params;
            if (!usr_uuid) {
                return res.status(400).json({ success: false, message: 'Falta el UUID del usuario.' });
            }

            const user = await SequelizeUser.findOne({ where: { usr_uuid } });
            if (!user) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
            }

            const applications = await SequelizeApplication.findAll({
                where: { app_active: true, app_hasaccess: true },
                include: [{ model: SequelizeApplicationSetting, as: 'settings' }]
            });

            const results: any[] = [];
            const userEmail = (user.usr_email || '').toLowerCase().trim();

            for (const app of applications) {
                const apiBaseUrl = this.resolveAppApiBaseUrl(app, (app as any).settings || []);
                if (!apiBaseUrl) {
                    results.push({
                        app_uuid: app.app_uuid,
                        app_cod: app.app_cod,
                        app_name: app.app_name,
                        api_configured: false,
                        existsRemotely: false,
                        message: 'Sin URL de API configurada.'
                    });
                    continue;
                }

                const endpointsToTry: string[] = [];
                if (apiBaseUrl.endsWith('/api')) {
                    endpointsToTry.push(`${apiBaseUrl}/users`);
                } else {
                    endpointsToTry.push(`${apiBaseUrl}/api/users`);
                    endpointsToTry.push(`${apiBaseUrl}/users`);
                }

                let existsRemotely = false;
                let remoteData: any = null;
                let fetchError = '';

                if (typeof fetch !== 'undefined') {
                    for (const url of endpointsToTry) {
                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 2500);
                            const response = await fetch(url, { signal: controller.signal });
                            clearTimeout(timeoutId);

                            if (response.ok) {
                                const json: any = await response.json();
                                const items = Array.isArray(json) 
                                    ? json 
                                    : (Array.isArray(json?.data) ? json.data : (Array.isArray(json?.users) ? json.users : []));

                                const found = items.find((u: any) => 
                                    (u.usr_email && u.usr_email.toLowerCase().trim() === userEmail) ||
                                    (u.email && u.email.toLowerCase().trim() === userEmail) ||
                                    (u.usr_nick && u.usr_nick.toLowerCase().trim() === (user.usr_nick || '').toLowerCase().trim())
                                );

                                if (found) {
                                    existsRemotely = true;
                                    remoteData = found;
                                }
                                fetchError = '';
                                break;
                            } else {
                                fetchError = `HTTP ${response.status}`;
                            }
                        } catch (err: any) {
                            fetchError = err.message || 'Timeout / Sin respuesta';
                        }
                    }
                }

                results.push({
                    app_uuid: app.app_uuid,
                    app_cod: app.app_cod,
                    app_name: app.app_name,
                    api_configured: true,
                    api_url: apiBaseUrl,
                    existsRemotely,
                    error: fetchError || null,
                    remoteUser: remoteData
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Verificación de presencia en satélites completada.',
                data: {
                    user: {
                        usr_uuid: user.usr_uuid,
                        usr_name: user.usr_name,
                        usr_surname: user.usr_surname,
                        usr_email: user.usr_email
                    },
                    satellitesPresence: results
                }
            });
        } catch (error: any) {
            console.error('Error en verifyUserSatellitesPresenceCtrl:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Error al verificar presencia remota del usuario.',
                error: error.message
            });
        }
    }
}