import { PayoutEntity, PayoutUpdateData } from "../../../domain/payout/payout.entity";
import { PayoutRepository } from "../../../domain/payout/payout.repository";
import { SequelizePayout } from "../../model/payout/payout.model";
import { SequelizeCompany } from "../../model/company/company.model";

export class SequelizePayoutRepository implements PayoutRepository {
    async getPayouts(cmp_uuid?: string): Promise<PayoutEntity[] | null> {
        try {
            const whereClause = cmp_uuid ? { cmp_uuid } : {};
            const payouts = await SequelizePayout.findAll({
                where: whereClause,
                include: [{ model: SequelizeCompany, as: 'company', attributes: ['cmp_uuid', 'cmp_name'] }],
                order: [['pay_createdat', 'DESC']]
            });
            return payouts;
        } catch (error: any) {
            console.error('Error en getPayouts:', error.message);
            throw error;
        }
    }

    async findPayoutById(pay_uuid: string): Promise<PayoutEntity | null> {
        try {
            const payout = await SequelizePayout.findByPk(pay_uuid, {
                include: [{ model: SequelizeCompany, as: 'company' }]
            });
            return payout ? payout.dataValues : null;
        } catch (error: any) {
            console.error('Error en findPayoutById:', error.message);
            throw error;
        }
    }

    async createPayout(payout: PayoutEntity): Promise<PayoutEntity | null> {
        try {
            const created = await SequelizePayout.create(payout as any);
            return created.dataValues;
        } catch (error: any) {
            console.error('Error en createPayout:', error.message);
            throw error;
        }
    }

    async updatePayout(pay_uuid: string, payout: PayoutUpdateData): Promise<PayoutEntity | null> {
        try {
            const [updatedRows] = await SequelizePayout.update(payout, {
                where: { pay_uuid }
            });
            if (updatedRows === 0) {
                throw new Error(`No se pudo actualizar la liquidación con Id: ${pay_uuid}`);
            }
            const updated = await SequelizePayout.findByPk(pay_uuid);
            return updated ? updated.dataValues : null;
        } catch (error: any) {
            console.error('Error en updatePayout:', error.message);
            throw error;
        }
    }

    async deletePayout(pay_uuid: string): Promise<PayoutEntity | null> {
        try {
            const payout = await SequelizePayout.findByPk(pay_uuid);
            if (!payout) {
                throw new Error(`No se encontró la liquidación con Id: ${pay_uuid}`);
            }
            await SequelizePayout.destroy({
                where: { pay_uuid }
            });
            return payout.dataValues;
        } catch (error: any) {
            console.error('Error en deletePayout:', error.message);
            throw error;
        }
    }
}
