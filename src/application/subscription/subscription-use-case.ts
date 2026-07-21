import { SubscriptionRepository } from "../../domain/subscription/subscription.repository";
import { SubscriptionEntity, SubscriptionUpdateData } from "../../domain/subscription/subscription.entity";
import { SubscriptionValue } from "../../domain/subscription/subscription.value";
import { SequelizeSubscriptionRepository } from "../../infrastructure/repository/subscription/sequelize-subscription.repository";

export class SubscriptionUseCase {
    constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

    public async getSubscriptions(): Promise<SubscriptionEntity[] | null> {
        const subscriptions = await this.subscriptionRepository.getSubscriptions();
        return subscriptions;
    }

    public async getDetailSubscription(pla_uuid: string, app_uuid: string, sub_uuid: string): Promise<SubscriptionEntity | null> {
        const subscription = await this.subscriptionRepository.findSubscriptionById(pla_uuid, app_uuid, sub_uuid);
        return subscription;
    }

    public async getSubscriptionsBySubscriber(subscriberType: string, subscriberId: string): Promise<SubscriptionEntity[] | null> {
        if (this.subscriptionRepository instanceof SequelizeSubscriptionRepository) {
            return await this.subscriptionRepository.findSubscriptionsBySubscriber(subscriberType, subscriberId);
        }
        return await this.subscriptionRepository.getSubscriptions();
    }

    public async saveSubscription(data: {
        pla_uuid: string;
        app_uuid: string;
        sub_subscribertype: string;
        usr_uuid?: string;
        cmp_uuid?: string;
        sub_status: string;
        sub_startsat: Date;
        sub_renewsat: Date;
        sub_endsat: Date;
        sub_active: boolean;
    }): Promise<SubscriptionEntity | null> {
        const subscriptionValue = new SubscriptionValue(data as any);
        const created = await this.subscriptionRepository.createSubscription(subscriptionValue);
        return created;
    }

    public async updateSubscription(pla_uuid: string, app_uuid: string, sub_uuid: string, updateData: SubscriptionUpdateData): Promise<SubscriptionEntity | null> {
        const updated = await this.subscriptionRepository.updateSubscription(pla_uuid, app_uuid, sub_uuid, updateData);
        return updated;
    }

    public async deleteSubscription(pla_uuid: string, app_uuid: string, sub_uuid: string): Promise<SubscriptionEntity | null> {
        const deleted = await this.subscriptionRepository.deleteSubscription(pla_uuid, app_uuid, sub_uuid);
        return deleted;
    }
}
