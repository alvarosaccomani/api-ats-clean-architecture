import * as jwt from 'jsonwebtoken';
import moment from 'moment';
import { UserEntity } from "../../domain/user/user.entity";

export class AuthService {
    private readonly secretKey: string;

    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    /**
     * Genera un token JWT para autenticación.
     * @param user - Datos del usuario.
     * @returns Token JWT válido por 30 días.
     */
    generateLoginToken(user: UserEntity): string {
        const payload = {
            sub: user.usr_uuid,
            usr_nick: user.usr_nick,
            usr_name: user.usr_name,
            usr_surname: user.usr_surname,
            usr_email: user.usr_email,
            iat: moment().unix(), // Tiempo de emisión
            exp: moment().add(30, 'days').unix(), // Expiración en 30 días
        };

        return jwt.sign(payload, this.secretKey);
    }

    /**
     * Genera un token JWT para confirmación de cuenta.
     * @param email - Correo electrónico del usuario.
     * @returns Token JWT válido por 1 día.
     */
    generateConfirmationToken(email: string): string {
        const payload = {
            email, // Solo incluimos el correo electrónico
            iat: moment().unix(), // Tiempo de emisión
            exp: moment().add(1, 'day').unix(), // Expiración en 1 día
        };

        return jwt.sign(payload, this.secretKey);
    }

    /**
     * Verifica y decodifica un token JWT.
     * @param token - Token JWT a verificar.
     * @returns Payload decodificado si el token es válido.
     * @throws Error si el token es inválido o ha expirado.
     */
    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            throw new Error('Token inválido o expirado.');
        }
    }
}