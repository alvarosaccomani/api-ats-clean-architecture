import crypto from 'crypto';

/**
 * Genera un token aleatorio.
 */
export const generateToken = (): string => {
  return crypto.randomBytes(20).toString('hex');
};

/**
 * Genera un hash SHA-256 a partir de un token.
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Calcula la fecha de expiración (10 minutos desde ahora).
 */
export const calculateExpiration = (): Date => {
  return new Date(Date.now() + 10 * 60 * 1000); // Expira en 10 minutos
};