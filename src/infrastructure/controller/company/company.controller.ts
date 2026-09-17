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

            const candidateBaseUrls: string[] = [];

            // Si se definieron api_domain y/o api_port
            if (apiDomain) {
                let domain = apiDomain.replace(/\/+$/, '');
                if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
                    domain = `http://${domain}`;
                }
                if (apiPort) {
                    if (domain.includes(':', 6)) {
                        candidateBaseUrls.push(domain);
                    } else {
                        candidateBaseUrls.push(`${domain}:${apiPort}`);
                    }
                } else {
                    candidateBaseUrls.push(domain);
                }
            }

            if (explicitApiUrl) {
                candidateBaseUrls.push(explicitApiUrl.replace(/\/+$/, ''));
            }

            if (appRecord.app_url) {
                const cleanFrontendUrl = appRecord.app_url.replace(/\/+$/, '');
                candidateBaseUrls.push(cleanFrontendUrl);

                // Si la URL es de desarrollo local (ej: http://localhost:4200), probar puertos de backend Node comunes
                if (cleanFrontendUrl.includes('localhost:4200') || cleanFrontendUrl.includes('localhost:4201') || cleanFrontendUrl.includes('localhost:4202')) {
                    candidateBaseUrls.push('http://localhost:3000');
                    candidateBaseUrls.push('http://localhost:3001');
                    candidateBaseUrls.push('http://localhost:8080');
                }
                // Si es un dominio de producción (ej: https://guva.com), probar subdominio api (https://api.guva.com)
                if (cleanFrontendUrl.includes('://') && !cleanFrontendUrl.includes('localhost')) {
                    const parts = cleanFrontendUrl.split('://');
                    candidateBaseUrls.push(`${parts[0]}://api.${parts[1]}`);
                }
            }

            // Armar lista de endpoints completos a probar (/api/companies y /companies)
            const endpointsToTry: string[] = [];
            for (const base of candidateBaseUrls) {
                endpointsToTry.push(`${base}/api/companies`);
                endpointsToTry.push(`${base}/companies`);
            }

            let remoteCompanies: any[] = [];
            let fetchSuccessful = false;

            if (typeof fetch !== 'undefined') {
                for (const url of endpointsToTry) {
                    try {
                        console.log(`[RemoteCompanies] Intentando consultar API satélite en: ${url}`);
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
                            console.warn(`[RemoteCompanies] ${url} respondió HTTP ${response.status}`);
                        }
                    } catch (fetchErr: any) {
                        console.warn(`[RemoteCompanies] No se pudo conectar a ${url}: ${fetchErr.message}`);
                    }
                }
            }

            // Fallback: Solo si la conexión falló completamente y no hubo respuesta remota
            if (!fetchSuccessful && remoteCompanies.length === 0) {
                console.log(`[RemoteCompanies] Sin respuesta remota para ${appRecord.app_name} (${appRecord.app_url}). Usando fallback local.`);
                const appCod = appRecord.app_cod?.toUpperCase() || 'APP';
                remoteCompanies = [
                    {
                        cmp_cod: `${appCod}_CMP_01`,
                        cmp_name: `Empresa Principal (${appRecord.app_name})`,
                        cmp_cuit: '30-71112233-4',
                        cmp_email: `contacto@${appRecord.app_cod.toLowerCase()}.com`,
                        cmp_phone: '+54 11 4000-1000',
                        cmp_description: `Empresa registrada localmente en la app satélite ${appRecord.app_name}`
                    },
                    {
                        cmp_cod: `${appCod}_CMP_02`,
                        cmp_name: `Sucursal Comercial (${appRecord.app_name})`,
                        cmp_cuit: '30-72223344-5',
                        cmp_email: `sucursal@${appRecord.app_cod.toLowerCase()}.com`,
                        cmp_phone: '+54 11 4000-2000',
                        cmp_description: `Unidad de negocio existente en ${appRecord.app_name}`
                    }
                ];
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
