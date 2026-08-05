import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { SequelizeUser } from '../model/user/user.model';

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export function ensureAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Acceso no autorizado.',
            error: 'La cabecera de autorización no está presente.'
        });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Acceso no autorizado.',
            error: 'Formato de cabecera de autorización inválido. Debe ser Bearer <token>'
        });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'web_app_atssuite_api';

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message: 'Acceso no autorizado.',
            error: 'Token inválido o expirado.'
        });
    }
}

export function ensureSysAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    ensureAuth(req, res, async () => {
        if (req.user && req.user.usr_sysadmin === true) {
            return next();
        }

        // Si no está en el token, consultar la DB en tiempo real (evita obligar a desloguearse)
        try {
            const userUuid = req.user?.sub;
            if (!userUuid) {
                return res.status(403).json({
                    success: false,
                    message: 'Acceso denegado.',
                    error: 'Identificación de usuario no válida.'
                });
            }

            const user = await SequelizeUser.findByPk(userUuid);
            if (user && user.usr_sysadmin === true) {
                return next();
            }

            return res.status(403).json({
                success: false,
                message: 'Acceso denegado.',
                error: 'Esta acción requiere privilegios de Administrador del Sistema (sysadmin).'
            });
        } catch (dbError: any) {
            return res.status(500).json({
                success: false,
                message: 'Error al verificar permisos.',
                error: dbError.message
            });
        }
    });
}
