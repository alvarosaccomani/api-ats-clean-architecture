import { PayoutRepository } from "../../domain/payout/payout.repository";
import { PayoutEntity, PayoutUpdateData } from "../../domain/payout/payout.entity";
import { PayoutValue } from "../../domain/payout/payout.value";
import { SequelizePayoutRepository } from "../../infrastructure/repository/payout/sequelize-payout.repository";

export class PayoutUseCase {
    constructor(private readonly payoutRepository: PayoutRepository) {}

    public async getPayouts(cmp_uuid?: string): Promise<PayoutEntity[] | null> {
        if (this.payoutRepository instanceof SequelizePayoutRepository) {
            return await this.payoutRepository.getPayouts(cmp_uuid);
        }
        return await this.payoutRepository.getPayouts();
    }

    public async getDetailPayout(pay_uuid: string): Promise<PayoutEntity | null> {
        const payout = await this.payoutRepository.findPayoutById(pay_uuid);
        return payout;
    }

    public async savePayout(data: {
        cmp_uuid: string;
        pay_amount: number;
        pay_currency: string;
        pay_status: string;
        pay_provider: string;
        pay_providerid?: string;
        pay_reference?: string;
    }): Promise<PayoutEntity | null> {
        const valueObj = new PayoutValue(data);
        const created = await this.payoutRepository.createPayout(valueObj);
        return created;
    }

    public async updatePayout(pay_uuid: string, updateData: PayoutUpdateData): Promise<PayoutEntity | null> {
        const updated = await this.payoutRepository.updatePayout(pay_uuid, updateData);
        return updated;
    }

    public async deletePayout(pay_uuid: string): Promise<PayoutEntity | null> {
        const deleted = await this.payoutRepository.deletePayout(pay_uuid);
        return deleted;
    }
}
