import { PlanEntity, PlanUpdateData } from "../../../domain/plan/plan.entity";
import { PlanRepository } from "../../../domain/plan/plan.repository";
import { SequelizePlan } from "../../model/plan/plan.model";
import { SequelizeApplication } from "../../model/application/application.model";
import { Op } from 'sequelize';

export class SequelizePlanRepository implements PlanRepository {
    async getPlans(): Promise<PlanEntity[] | null> {
        try {
            const plans = await SequelizePlan.findAll({
                include: [{ model: SequelizeApplication, as: 'application' }]
            });
            return plans;
        } catch (error: any) {
            console.error('Error en getPlans:', error.message);
            throw error;
        }
    }

    async findPlanById(pla_uuid: string, app_uuid?: string): Promise<PlanEntity | null> {
        try {
            const whereClause: any = { pla_uuid: pla_uuid ?? null };
            if (app_uuid) whereClause.app_uuid = app_uuid;

            const plan = await SequelizePlan.findOne({
                where: whereClause,
                include: [{ model: SequelizeApplication, as: 'application' }]
            });
            if (!plan) {
                throw new Error(`No se encontró el plan con Id: ${pla_uuid}`);
            }
            return plan.dataValues;
        } catch (error: any) {
            console.error('Error en findPlanById:', error.message);
            throw error;
        }
    }

    async createPlan(plan: PlanEntity): Promise<PlanEntity | null> {
        try {
            const created = await SequelizePlan.create(plan as any);
            return created.dataValues;
        } catch (error: any) {
            console.error('Error en createPlan:', error.message);
            throw error;
        }
    }

    async updatePlan(pla_uuid: string, app_uuid: string, planData: PlanUpdateData): Promise<PlanEntity | null> {
        try {
            const [updatedRows] = await SequelizePlan.update(planData, {
                where: { pla_uuid }
            });
            if (updatedRows === 0) {
                throw new Error(`No se pudo actualizar el plan con Id: ${pla_uuid}`);
            }
            const updated = await SequelizePlan.findByPk(pla_uuid);
            return updated ? updated.dataValues : null;
        } catch (error: any) {
            console.error('Error en updatePlan:', error.message);
            throw error;
        }
    }

    async deletePlan(pla_uuid: string, app_uuid: string): Promise<PlanEntity | null> {
        try {
            const plan = await SequelizePlan.findByPk(pla_uuid);
            if (!plan) {
                throw new Error(`No se encontró el plan con Id: ${pla_uuid}`);
            }
            await SequelizePlan.destroy({
                where: { pla_uuid }
            });
            return plan.dataValues;
        } catch (error: any) {
            console.error('Error en deletePlan:', error.message);
            throw error;
        }
    }

    async findPlanByName(pla_cod: string, pla_name: string): Promise<PlanEntity | null> {
        try {
            const plan = await SequelizePlan.findOne({
                where: {
                    [Op.or]: [
                        { pla_cod: pla_cod ?? null },
                        { pla_name: pla_name ?? null }
                    ]
                }
            });
            return plan ? plan.dataValues : null;
        } catch (error: any) {
            console.error('Error en findPlanByName:', error.message);
            throw error;
        }
    }
}
