import { Request, Response } from "express";
import { CompanyUseCase } from "../../../application/company/company-use-case";
import { SequelizeApplication } from "../../model/application/application.model";
import { SequelizeApplicationSetting } from "../../model/application-setting/application-setting.model";
import { Op } from "sequelize";

export class CompanyController {
    constructor(private companyUseCase: CompanyUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
        this.getRemoteSatelliteCompaniesCtrl = this.getRemoteSatelliteCompaniesCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const companies = await this.companyUseCase.getCompanies();
            return res.status(200).send({
                success: true,
                message: 'Empresas retornadas.',
                data: companies
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (CompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las empresas.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const cmp_uuid = req.params.cmp_uuid;
            if (!cmp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la empresa.',
                    error: 'Debe proporcionar un Id de empresa.'
                });
            }
            const company = await this.companyUseCase.getDetailCompany(cmp_uuid);
            return res.status(200).send({
                success: true,
                message: 'Empresa retornada.',
                data: company
            });
        } catch (error: any) {
            console.error('Error en getCtrl (CompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar la empresa.',
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: Request, res: Response) {
        try {
            const { cmp_cod, cmp_name } = req.body;
            if (!cmp_cod || !cmp_name) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo registrar la empresa.',
                    error: 'Debe proporcionar el Código (cmp_cod) y Nombre (cmp_name).'
                });
            }

            const authenticatedUser = (req as any).user;
            const usr_uuid = req.body.usr_uuid || authenticatedUser?.sub || authenticatedUser?.usr_uuid;
            const payload = {
                ...req.body,
                usr_uuid
            };

            const company = await this.companyUseCase.saveCompany(payload);
            return res.status(200).json({
                success: true,
                message: 'Empresa registrada.',
                data: company
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (CompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar la empresa.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const cmp_uuid = req.params.cmp_uuid;
            const update = req.body;
            if (!cmp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar la empresa.',
                    error: 'Debe proporcionar un Id de empresa.'
                });
            }
            const company = await this.companyUseCase.updateCompany(cmp_uuid, update);
            return res.status(200).json({
                success: true,
                message: 'Empresa actualizada.',
                data: company
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (CompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la empresa.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const cmp_uuid = req.params.cmp_uuid;
            if (!cmp_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar la empresa.',
                    error: 'Debe proporcionar un Id de empresa.'
                });
            }
            const company = await this.companyUseCase.deleteCompany(cmp_uuid);
            return res.status(200).json({
                success: true,
                message: 'Empresa eliminada.',
                data: company
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (CompanyController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la empresa.',
                error: error.message,
            });
        }
    }

    public async getRemoteSatelliteCompaniesCtrl(req: Request, res: Response) {
        try {
            const app_uuid = req.params.app_uuid;
            const appRecord = await SequelizeApplication.findByPk(app_uuid);
            if (!appRecord) {
                return res.status(404).json({
                    success: false,
                    message: 'Aplicación no encontrada.'
                });
            }

            const existingCompanies = await this.companyUseCase.getCompanies() || [];

            // 1. Buscar configuraciones de la app en apps_applicationssettings (api_domain, api_port, api_url, backend_url)
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
                // Fallback a app_url solo si no hay configuración específica de API
                apiBaseUrl = appRecord.app_url.replace(/\/+$/, '');
            }

            if (!apiBaseUrl) {
                return res.status(200).json({
                    success: false,
                    message: `La aplicación "${appRecord.app_name}" no tiene configurada la URL de su API (configurar api_domain y api_port, o api_url en settings).`,
                    data: []
                });
            }

            // Armar endpoints limpios según la base configurada
            const endpointsToTry: string[] = [];
            if (apiBaseUrl.endsWith('/api')) {
                endpointsToTry.push(`${apiBaseUrl}/companies`);
            } else {
                endpointsToTry.push(`${apiBaseUrl}/api/companies`);
                endpointsToTry.push(`${apiBaseUrl}/companies`);
            }

            let remoteCompanies: any[] = [];
            let fetchSuccessful = false;
            let lastErrorMessage = '';

            if (typeof fetch !== 'undefined') {
                for (const url of endpointsToTry) {
                    try {
                        console.log(`[RemoteCompanies] Consultando API satélite en: ${url}`);
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 4000);
                        const response = await fetch(url, { signal: controller.signal });
                        clearTimeout(timeoutId);

                        if (response.ok) {
                            fetchSuccessful = true;
                            const json: any = await response.json();
                            const items = Array.isArray(json) 
                                ? json 
                                : (Array.isArray(json?.data) ? json.data : (Array.isArray(json?.companies) ? json.companies : []));

                            console.log(`[RemoteCompanies] ¡Éxito! Se obtuvieron ${items.length} empresas desde: ${url}`);
                            remoteCompanies = items;
                            break;
                        } else {
                            lastErrorMessage = `HTTP ${response.status} en ${url}`;
                            console.warn(`[RemoteCompanies] ${url} respondió HTTP ${response.status}`);
                        }
                    } catch (fetchErr: any) {
                        lastErrorMessage = fetchErr.message;
                        console.warn(`[RemoteCompanies] No se pudo conectar a ${url}: ${fetchErr.message}`);
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

            const result = remoteCompanies.map((rc: any) => {
                const found = existingCompanies.find(ec => 
                    (rc.cmp_uuid && ec.cmp_uuid === rc.cmp_uuid) ||
                    (rc.cmp_cod && ec.cmp_cod?.toUpperCase() === rc.cmp_cod?.toUpperCase()) ||
                    (ec.cmp_cuit && rc.cmp_cuit && ec.cmp_cuit === rc.cmp_cuit) ||
                    (rc.cmp_name && ec.cmp_name?.toLowerCase() === rc.cmp_name?.toLowerCase())
                );
                return {
                    ...rc,
                    cmp_cod: rc.cmp_cod || (rc.cmp_uuid ? rc.cmp_uuid.substring(0, 8).toUpperCase() : 'CMP'),
                    alreadyImported: !!found,
                    existingCmpUuid: found?.cmp_uuid || null
                };
            });

            return res.status(200).json({
                success: true,
                message: `Empresas remotas de la app ${appRecord.app_name} retornadas.`,
                data: result
            });
        } catch (error: any) {
            console.error('Error en getRemoteSatelliteCompaniesCtrl:', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las empresas remotas de la aplicación.',
                error: error.message
            });
        }
    }
}
