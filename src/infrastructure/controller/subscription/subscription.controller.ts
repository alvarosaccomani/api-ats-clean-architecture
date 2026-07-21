import { Request, Response } from "express";
import { SubscriptionUseCase } from "../../../application/subscription/subscription-use-case";

export class SubscriptionController {
    constructor(private subscriptionUseCase: SubscriptionUseCase) {
        this.getAllCtrl = this.getAllCtrl.bind(this);
        this.getBySubscriberCtrl = this.getBySubscriberCtrl.bind(this);
        this.getCtrl = this.getCtrl.bind(this);
        this.saveCtrl = this.saveCtrl.bind(this);
        this.updateCtrl = this.updateCtrl.bind(this);
        this.deleteCtrl = this.deleteCtrl.bind(this);
    }

    public async getAllCtrl(req: Request, res: Response) {
        try {
            const subscriptions = await this.subscriptionUseCase.getSubscriptions();
            return res.status(200).send({
                success: true,
                message: 'Suscripciones retornadas.',
                data: subscriptions
            });
        } catch (error: any) {
            console.error('Error en getAllCtrl (SubscriptionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las suscripciones.',
                error: error.message,
            });
        }
    }

    public async getBySubscriberCtrl(req: Request, res: Response) {
        try {
            const { type, id } = req.params; // type = 'USER' | 'COMPANY'
            if (!type || !id) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudieron recuperar las suscripciones del suscriptor.',
                    error: 'Debe proporcionar el Tipo (USER u COMPANY) y el Id de suscriptor.'
                });
            }
            const subscriptions = await this.subscriptionUseCase.getSubscriptionsBySubscriber(type.toUpperCase(), id);
            return res.status(200).send({
                success: true,
                message: 'Suscripciones del suscriptor retornadas.',
                data: subscriptions
            });
        } catch (error: any) {
            console.error('Error en getBySubscriberCtrl (SubscriptionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudieron recuperar las suscripciones del suscriptor.',
                error: error.message,
            });
        }
    }

    public async getCtrl(req: Request, res: Response) {
        try {
            const sub_uuid = req.params.sub_uuid;
            if (!sub_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo recuperar la suscripción.',
                    error: 'Debe proporcionar un Id de suscripción.'
                });
            }
            const subscription = await this.subscriptionUseCase.getDetailSubscription('', '', sub_uuid);
            return res.status(200).send({
                success: true,
                message: 'Suscripción retornada.',
                data: subscription
            });
        } catch (error: any) {
            console.error('Error en getCtrl (SubscriptionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo recuperar la suscripción.',
                error: error.message,
            });
        }
    }

    public async saveCtrl(req: Request, res: Response) {
        try {
            const { pla_uuid, app_uuid, sub_subscribertype } = req.body;
            if (!pla_uuid || !app_uuid || !sub_subscribertype) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo registrar la suscripción.',
                    error: 'Debe proporcionar pla_uuid, app_uuid y sub_subscribertype.'
                });
            }
            const subscription = await this.subscriptionUseCase.saveSubscription(req.body);
            return res.status(200).json({
                success: true,
                message: 'Suscripción registrada.',
                data: subscription
            });
        } catch (error: any) {
            console.error('Error en saveCtrl (SubscriptionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo registrar la suscripción.',
                error: error.message,
            });
        }
    }

    public async updateCtrl(req: Request, res: Response) {
        try {
            const sub_uuid = req.params.sub_uuid;
            const update = req.body;
            if (!sub_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar la suscripción.',
                    error: 'Debe proporcionar un Id de suscripción.'
                });
            }
            const subscription = await this.subscriptionUseCase.updateSubscription('', '', sub_uuid, update);
            return res.status(200).json({
                success: true,
                message: 'Suscripción actualizada.',
                data: subscription
            });
        } catch (error: any) {
            console.error('Error en updateCtrl (SubscriptionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar la suscripción.',
                error: error.message,
            });
        }
    }

    public async deleteCtrl(req: Request, res: Response) {
        try {
            const sub_uuid = req.params.sub_uuid;
            if (!sub_uuid) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar la suscripción.',
                    error: 'Debe proporcionar un Id de suscripción.'
                });
            }
            const subscription = await this.subscriptionUseCase.deleteSubscription('', '', sub_uuid);
            return res.status(200).json({
                success: true,
                message: 'Suscripción eliminada.',
                data: subscription
            });
        } catch (error: any) {
            console.error('Error en deleteCtrl (SubscriptionController):', error.message);
            return res.status(400).json({
                success: false,
                message: 'No se pudo eliminar la suscripción.',
                error: error.message,
            });
        }
    }
}
