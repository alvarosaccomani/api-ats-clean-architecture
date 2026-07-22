import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

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
