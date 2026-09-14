import { SubscriptionEntity, SubscriptionUpdateData } from "../../../domain/subscription/subscription.entity";
import { SubscriptionRepository } from "../../../domain/subscription/subscription.repository";
import { SequelizeSubscription } from "../../model/subscription/subscription.model";
import { SequelizePlan } from "../../model/plan/plan.model";
import { SequelizeApplication } from "../../model/application/application.model";
import { SequelizeUser } from "../../model/user/user.model";
import { SequelizeCompany } from "../../model/company/company.model";
import { v4 as uuidv4 } from "uuid";

export class SequelizeSubscriptionRepository implements SubscriptionRepository {
    async getSubscriptions(): Promise<SubscriptionEntity[] | null> {
        try {
            const subscriptions = await SequelizeSubscription.findAll({
                include: [
                    { model: SequelizePlan, as: 'plan' },
                    { model: SequelizeApplication, as: 'application' },
                    { model: SequelizeCompany, as: 'company' }
                ]
            });
            return subscriptions;
        } catch (error: any) {
            console.error('Error en getSubscriptions:', error.message);
            throw error;
        }
    }

    async findSubscriptionById(pla_uuid: string, app_uuid: string, sub_uuid: string): Promise<SubscriptionEntity | null> {
        try {
            const subscription = await SequelizeSubscription.findOne({
                where: { sub_uuid: sub_uuid ?? null },
                include: [
                    { model: SequelizePlan, as: 'plan' },
                    { model: SequelizeApplication, as: 'application' },
                    { model: SequelizeCompany, as: 'company' }
                ]
            });
            if (!subscription) {
                throw new Error(`No se encontró la suscripción con Id: ${sub_uuid}`);
            }
            return subscription.dataValues;
        } catch (error: any) {
            console.error('Error en findSubscriptionById:', error.message);
            throw error;
        }
    }

    async createSubscription(subscription: SubscriptionEntity): Promise<SubscriptionEntity | null> {
        try {
            const created = await SequelizeSubscription.create(subscription as any);
            return created.dataValues;
        } catch (error: any) {
            console.error('Error en createSubscription:', error.message);
            throw error;
        }
    }

    async updateSubscription(pla_uuid: string, app_uuid: string, sub_uuid: string, updateData: SubscriptionUpdateData): Promise<SubscriptionEntity | null> {
        try {
            const [updatedRows] = await SequelizeSubscription.update(updateData, {
                where: { sub_uuid }
            });
            if (updatedRows === 0) {
                throw new Error(`No se pudo actualizar la suscripción con Id: ${sub_uuid}`);
            }
            const updated = await SequelizeSubscription.findByPk(sub_uuid);
            return updated ? updated.dataValues : null;
        } catch (error: any) {
            console.error('Error en updateSubscription:', error.message);
            throw error;
        }
    }

    async deleteSubscription(pla_uuid: string, app_uuid: string, sub_uuid: string): Promise<SubscriptionEntity | null> {
        try {
            const subscription = await SequelizeSubscription.findByPk(sub_uuid);
            if (!subscription) {
                throw new Error(`No se encontró la suscripción con Id: ${sub_uuid}`);
            }
            await SequelizeSubscription.destroy({
                where: { sub_uuid }
            });
            return subscription.dataValues;
        } catch (error: any) {
            console.error('Error en deleteSubscription:', error.message);
            throw error;
        }
    }

    async findSubscriptionByName(cmp_code: string, cmp_name: string): Promise<SubscriptionEntity | null> {
        return null;
    }

    async findSubscriptionsBySubscriber(subscriberType: string, subscriberId: string): Promise<SubscriptionEntity[] | null> {
        try {
            const whereClause: any = { sub_subscribertype: subscriberType };
            if (subscriberType === 'USER') {
                whereClause.usr_uuid = subscriberId;
            } else {
                whereClause.cmp_uuid = subscriberId;
            }

            const subscriptions = await SequelizeSubscription.findAll({
                where: whereClause,
                include: [
                    { model: SequelizePlan, as: 'plan' },
                    { model: SequelizeApplication, as: 'application' }
                ]
            });
            return subscriptions;
        } catch (error: any) {
            console.error('Error en findSubscriptionsBySubscriber:', error.message);
            throw error;
        }
    }

    async subscribeNatively(data: { app_cod: string; pla_uuid: string; subscriber_type: 'USER' | 'COMPANY'; subscriber_id: string }): Promise<SubscriptionEntity | null> {
        try {
            const { app_cod, pla_uuid, subscriber_type, subscriber_id } = data;

            const app = await SequelizeApplication.findOne({ where: { app_cod } });
            if (!app) {
                throw new Error(`La aplicación con código '${app_cod}' no existe.`);
            }

            const plan = await SequelizePlan.findOne({ where: { pla_uuid } });
            if (!plan) {
                throw new Error(`El plan con ID '${pla_uuid}' no existe.`);
            }

            const whereClause: any = {
                sub_subscribertype: subscriber_type,
                app_uuid: app.app_uuid
            };
            if (subscriber_type === 'USER') {
                whereClause.usr_uuid = subscriber_id;
            } else {
                whereClause.cmp_uuid = subscriber_id;
            }

            let existingSubscription = await SequelizeSubscription.findOne({ where: whereClause });

            if (existingSubscription) {
                await SequelizeSubscription.update(
                    {
                        pla_uuid: plan.pla_uuid,
                        sub_active: true,
                        sub_status: 'ACTIVE',
                        sub_renewsat: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    },
                    { where: { sub_uuid: existingSubscription.sub_uuid } }
                );

                const updated = await SequelizeSubscription.findByPk(existingSubscription.sub_uuid, {
                    include: [
                        { model: SequelizePlan, as: 'plan' },
                        { model: SequelizeApplication, as: 'application' }
                    ]
                });
                return updated ? updated.dataValues : null;
            } else {
                const sub_uuid = uuidv4();
                const newSubData: any = {
                    sub_uuid,
                    pla_uuid: plan.pla_uuid,
                    app_uuid: app.app_uuid,
                    sub_subscribertype: subscriber_type,
                    usr_uuid: subscriber_type === 'USER' ? subscriber_id : null,
                    cmp_uuid: subscriber_type === 'COMPANY' ? subscriber_id : null,
                    sub_status: 'ACTIVE',
                    sub_active: true,
                    sub_startsat: new Date(),
                    sub_renewsat: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                };

                const created = await SequelizeSubscription.create(newSubData);
                const result = await SequelizeSubscription.findByPk(created.sub_uuid, {
                    include: [
                        { model: SequelizePlan, as: 'plan' },
                        { model: SequelizeApplication, as: 'application' }
                    ]
                });
                return result ? result.dataValues : null;
            }
        } catch (error: any) {
            console.error('Error en subscribeNatively:', error.message);
            throw error;
        }
    }
}
