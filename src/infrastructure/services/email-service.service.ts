import nodemailer from 'nodemailer';

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE || 'Gmail',
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // use false for STARTTLS; true for SSL on port 465
            auth: {
                user: process.env.EMAIL_FROM, // Tu correo
                pass: process.env.EMAIL_PASSWORD, // Tu contraseña
            },
        });
    }

    private getEmailTemplate(
        title: string, 
        contentHtml: string, 
        ctaText?: string, 
        ctaUrl?: string, 
        app?: any, 
        settings?: Record<string, string>
    ): string {
        const ctaButtonHtml = ctaText && ctaUrl ? `
            <div style="text-align: center; margin: 30px 0;">
                <a href="${ctaUrl}" style="background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px rgba(24, 144, 255, 0.25);">
                    ${ctaText}
                </a>
            </div>
        ` : '';

        const fallbackLinkHtml = ctaUrl ? `
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 13px;">
                Si el botón no funciona, podés copiar y pegar este enlace en tu navegador:<br>
                <a href="${ctaUrl}" style="color: #1890ff; text-decoration: none; word-break: break-all; display: block; margin-top: 8px;">${ctaUrl}</a>
            </div>
        ` : '';

        const headerBg = settings?.['email_header_bg'] || '#0f172a';
        const headerTextColor = settings?.['email_header_text'] || '#ffffff';
        const logoUrl = settings?.['email_logo_url'] || null;
        const appName = app?.app_name || 'ATS Suite';

        const logoHtml = logoUrl ? `
            <div style="text-align: center; margin-bottom: 15px;">
                <img src="${logoUrl}" alt="${appName}" style="max-height: 48px; display: inline-block;" />
            </div>
        ` : '';

        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f4f6f8; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); margin: 0 20px;">
                                <!-- Header con Color/Estilo Corporativo de la App -->
                                <tr>
                                    <td align="center" style="background: ${headerBg}; padding: 30px 20px;">
                                        ${logoHtml}
                                        <h1 style="color: ${headerTextColor}; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">
                                            ${appName}
                                        </h1>
                                    </td>
                                </tr>
                                <!-- Contenido Principal -->
                                <tr>
                                    <td style="padding: 40px 30px; background-color: #ffffff;">
                                        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 20px; font-size: 20px; font-weight: 600; text-align: center;">
                                            ${title}
                                        </h2>
                                        <div style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                                            ${contentHtml}
                                        </div>
                                        ${ctaButtonHtml}
                                        ${fallbackLinkHtml}
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td align="center" style="background-color: #f8fafc; padding: 20px; border-top: 1px solid #f1f5f9;">
                                        <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                                            Este es un correo automático, por favor no respondas a este mensaje.<br>
                                            © ${new Date().getFullYear()} ${appName}. Todos los derechos reservados.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;
    }

    /**
     * Envía un correo de confirmación de cuenta.
     * @param to - Dirección de correo del destinatario.
     * @param confirmationToken - Token de confirmación.
     * @param app - Aplicación satélite que solicita el envío.
     * @param settings - Mapa de configuraciones visuales de la aplicación.
     */
    async sendConfirmationEmail(to: string, confirmationToken: string, app?: any, settings?: Record<string, string>): Promise<void> {
        let baseUrl = app?.app_url || process.env.URL_CONFIRMATION || 'http://localhost:4200';
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }
        const confirmationUrl = `${baseUrl}/auth/account-confirmed/${confirmationToken}`;
        const appName = app?.app_name || 'ATS Suite';

        const contentHtml = `
            <p>¡Hola!</p>
            <p>Gracias por registrarte en nuestra plataforma. Para poder activar tu cuenta y empezar a operar, por favor confirma tu dirección de correo electrónico haciendo clic en el botón de abajo.</p>
        `;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: `Confirma tu cuenta - ${appName}`,
            html: this.getEmailTemplate(`¡Bienvenido/a a ${appName}!`, contentHtml, 'Confirmar Cuenta', confirmationUrl, app, settings),
        };

        await this.transporter.sendMail(mailOptions);
    }

    /**
     * Envía un correo de reestablecimiento de contraseña.
     * @param to - Dirección de correo del destinatario.
     * @param resetToken - Token de restablecimiento.
     * @param app - Aplicación satélite que solicita el envío.
     * @param settings - Mapa de configuraciones visuales de la aplicación.
     */
    async sendReestablishmentEmail(to: string, resetToken: string, app?: any, settings?: Record<string, string>): Promise<void> {
        let baseUrl = app?.app_url || process.env.URL_RESET || 'http://localhost:4200';
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }
        const resetUrl = `${baseUrl}/auth/reset-password/${resetToken}`;
        const appName = app?.app_name || 'ATS Suite';

        const contentHtml = `
            <p>Hola,</p>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en ${appName}. Para configurar una nueva contraseña, por favor haz clic en el botón de abajo:</p>
            <p style="margin-top: 20px; font-size: 14px; color: #64748b; font-style: italic;">Si no realizaste esta solicitud, podés ignorar este correo de forma segura. Tu contraseña actual no se verá afectada.</p>
        `;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: `Restablecer contraseña - ${appName}`,
            html: this.getEmailTemplate('Restablecimiento de Contraseña', contentHtml, 'Restablecer Contraseña', resetUrl, app, settings),
        };

        await this.transporter.sendMail(mailOptions);
    }

    /**
     * Envía un correo genérico con plantilla corporativa.
     */
    async sendEmail(
        to: string, 
        subject: string, 
        title: string, 
        contentHtml: string, 
        ctaText?: string, 
        ctaUrl?: string, 
        app?: any, 
        settings?: Record<string, string>
    ): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html: this.getEmailTemplate(title, contentHtml, ctaText, ctaUrl, app, settings),
        };

        await this.transporter.sendMail(mailOptions);
    }
}

export const emailService = new EmailService();