import { AuthRepository } from "../../domain/auth/auth.repository";
import { UserValue } from "../../domain/user/user.value";

export class AuthUseCase {
    constructor(
        private readonly authRepository: AuthRepository
    ) {
        this.loginUser = this.loginUser.bind(this);
        this.confirmAccount = this.confirmAccount.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.getUserByResetToken = this.getUserByResetToken.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.userNickExist = this.userNickExist.bind(this);
        this.userEmailExist = this.userEmailExist.bind(this);
        this.registerUser = this.registerUser.bind(this);
    }

    public async loginUser(usr_nick: string, usr_password: string, gettoken: boolean) {
        try {
            const user = await this.authRepository.loginUser(usr_nick, usr_password, gettoken);
            if (!user) {
                throw new Error('Credenciales incorrectas.');
            }
            return user;
        } catch (error: any) {
            console.error('Error en loginUser (use case):', error.message);
            throw error;
        }
    }

    public async confirmAccount( usr_confirmationtoken: string = '' ) {
        const userConfirmation = await this.authRepository.confirmAccount(usr_confirmationtoken);
        return userConfirmation;
    }

    public async forgotPassword ( usr_email: string = '' ) {        
        try {
            const user = await this.authRepository.findUserByEmail(usr_email);

            if (!user) {
                throw new Error('No se encontró ningún usuario con este correo electrónico.');
            }

            const userForgotPassword = await this.authRepository.forgotPassword(user);
            return userForgotPassword;
        } catch (error: any) {
            console.error('Error en forgotPassword (use case):', error.message);
            throw error;
        }
    }

    public async getUserByResetToken(token: string, expirationDate: Date) {
        try {
            const user = await this.authRepository.findUserByResetToken(token, expirationDate);
            return user;
        } catch (error: any) {
            console.error('Error en getUserByResetToken (use case):', error.message);
            throw error;
        }
    }

    public async updatePassword(usr_uuid: string, newPassword: string) {
        try {
            await this.authRepository.updatePassword(usr_uuid, newPassword);
        } catch (error: any) {
            console.error('Error en updatePassword (use case):', error.message);
            throw error;
        }
    }

    public async userNickExist(usr_nick: string): Promise<boolean> {
        try {
            const user = await this.authRepository.findUserByNick(usr_nick);
            return !!user;
        } catch (error: any) {
            console.error('Error en userNickExist (use case):', error.message);
            throw error;
        }
    }

    public async userEmailExist(usr_email: string): Promise<boolean> {
        try {
            const user = await this.authRepository.findUserByEmail(usr_email);
            return !!user;
        } catch (error: any) {
            console.error('Error en userEmailExist (use case):', error.message);
            throw error;
        }
    }

    public async registerUser({ usr_uuid, usr_name, usr_surname, usr_password, usr_image, usr_email, usr_nick, usr_bio, usr_registered, usr_socket, usr_online, usr_confirmed, usr_confirmationtoken, usr_resetpasswordtoken, usr_resetpasswordexpires, usr_sysadmin } : { usr_uuid: string, usr_name: string, usr_surname: string, usr_password: string, usr_image: string, usr_email: string, usr_nick: string, usr_bio: string, usr_registered: Date, usr_socket: string, usr_online: boolean, usr_confirmed: boolean, usr_confirmationtoken: string, usr_resetpasswordtoken: string, usr_resetpasswordexpires: Date, usr_sysadmin: boolean }) {
        try {
            const userValue = new UserValue({ usr_uuid, usr_name, usr_surname, usr_password, usr_image, usr_email, usr_nick, usr_bio, usr_registered, usr_socket, usr_online, usr_confirmed, usr_confirmationtoken, usr_resetpasswordtoken, usr_resetpasswordexpires, usr_sysadmin });
            const userCreated = await this.authRepository.registerUser(userValue);
            if(!userCreated) {
                throw new Error(`No se pudo registrar el usuario.`);
            }
            return {
                usr_uuid: userCreated.usr_uuid,
                usr_name: userCreated.usr_name,
                usr_surname: userCreated.usr_surname,
                usr_image: userCreated.usr_image,
                usr_email: userCreated.usr_email,
                usr_nick: userCreated.usr_nick,
                usr_bio: userCreated.usr_bio,
                usr_registered: userCreated.usr_registered,
                usr_socket: userCreated.usr_socket,
                usr_online: userCreated.usr_online,
                usr_confirmed: userCreated.usr_confirmed,
                usr_confirmationtoken: userCreated.usr_confirmationtoken,
                usr_resetpasswordtoken: userCreated.usr_resetpasswordtoken,
                usr_resetpasswordexpires: userCreated.usr_resetpasswordexpires,
                usr_sysadmin: userCreated.usr_sysadmin,
                usr_createdat: userCreated.usr_createdat,
                usr_updatedat: userCreated.usr_updatedat
            };
        } catch (error: any) {
            console.error('Error en registerUser (use case):', error.message);
            throw error;
        }
    }
}
