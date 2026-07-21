import { PlanEntity, PlanUpdateData } from "./plan.entity";

export interface PlanRepository {
    getPlans(): Promise<PlanEntity[] | null>;
    findPlanById(pla_uuid: string, app_uuid: string): Promise<PlanEntity | null>;
    createPlan(plan: PlanEntity): Promise<PlanEntity | null>;
    updatePlan(pla_uuid: string, app_uuid: string, plan: PlanUpdateData): Promise<PlanEntity | null>;
    deletePlan(pla_uuid: string, app_uuid: string): Promise<PlanEntity | null>;
    findPlanByName(pla_code: string, pla_name: string): Promise<PlanEntity | null>;
}