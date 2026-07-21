import { SubscriptionEntity, SubscriptionUpdateData } from "./subscription.entity";

export interface SubscriptionRepository {
    getSubscriptions(): Promise<SubscriptionEntity[] | null>;
    findSubscriptionById(pla_uuid: string, app_uuid: string, sub_uuid: string): Promise<SubscriptionEntity | null>;
    createSubscription(subscription: SubscriptionEntity): Promise<SubscriptionEntity | null>;
    updateSubscription(pla_uuid: string, app_uuid: string, sub_uuid: string, subscription: SubscriptionUpdateData): Promise<SubscriptionEntity | null>;
    deleteSubscription(pla_uuid: string, app_uuid: string, sub_uuid: string): Promise<SubscriptionEntity | null>;
    findSubscriptionByName(cmp_code: string, cmp_name: string): Promise<SubscriptionEntity | null>;
}