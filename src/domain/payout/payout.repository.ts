import { PayoutEntity, PayoutUpdateData } from "./payout.entity";

export interface PayoutRepository {
    getPayouts(): Promise<PayoutEntity[] | null>;
    findPayoutById(pay_uuid: string): Promise<PayoutEntity | null>;
    createPayout(payout: PayoutEntity): Promise<PayoutEntity | null>;
    updatePayout(pay_uuid: string, payout: PayoutUpdateData): Promise<PayoutEntity | null>;
    deletePayout(pay_uuid: string): Promise<PayoutEntity | null>;
}