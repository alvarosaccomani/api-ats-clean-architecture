import { PlanRepository } from "../../domain/plan/plan.repository";
import { PlanEntity, PlanUpdateData } from "../../domain/plan/plan.entity";
import { PlanValue } from "../../domain/plan/plan.value";

export class PlanUseCase {
    constructor(private readonly planRepository: PlanRepository) {}

    public async getPlans(): Promise<PlanEntity[] | null> {
        const plans = await this.planRepository.getPlans();
        return plans;
    }

    public async getDetailPlan(pla_uuid: string, app_uuid?: string): Promise<PlanEntity | null> {
        const plan = await this.planRepository.findPlanById(pla_uuid, app_uuid || '');
        return plan;
    }

    public async savePlan(planData: {
        app_uuid: string;
        pla_cod: string;
        pla_name: string;
        pla_description: string;
        pla_price: number;
        pla_currency: string;
        pla_billingcycle: string;
        pla_pricingtype: string;
        pla_platformfeepercent: number;
        pla_active: boolean;
    }): Promise<PlanEntity | null> {
        const planValue = new PlanValue(planData);
        const planCreated = await this.planRepository.createPlan(planValue);
        return planCreated;
    }

    public async updatePlan(pla_uuid: string, app_uuid: string, updateData: PlanUpdateData): Promise<PlanEntity | null> {
        const planUpdated = await this.planRepository.updatePlan(pla_uuid, app_uuid, updateData);
        return planUpdated;
    }

    public async deletePlan(pla_uuid: string, app_uuid: string): Promise<PlanEntity | null> {
        const planDeleted = await this.planRepository.deletePlan(pla_uuid, app_uuid);
        return planDeleted;
    }
}
