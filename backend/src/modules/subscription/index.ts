// src/modules/subscription/index.ts
// External module surface for subscription. Keep explicit; no export *.

export { registerSubscription } from './router';
export { registerSubscriptionAdmin } from './admin.routes';

export {
  listPlans,
  getPlan,
  getMySubscription,
  listMyHistory,
  purchasePlan,
  cancelSubscription,
} from './controller';

export {
  adminListPlans,
  adminGetPlan,
  adminCreatePlan,
  adminUpdatePlan,
  adminDeletePlan,
  adminListSubscriptions,
} from './admin.controller';

export { deductForPlan } from './service';

export {
  createAdminPlanInsert,
  buildAdminPlanPatch,
} from './helpers';

export {
  repoListPlans,
  repoGetPlanById,
  repoGetPlanBySlug,
  repoCreatePlan,
  repoUpdatePlan,
  repoDeletePlan,
  repoGetActiveSubscription,
  repoCreateSubscription,
  repoCancelSubscription,
  repoListUserSubscriptions,
  repoCountMonthlyIlans,
  repoGetFreeQuota,
  repoListAllSubscriptions,
} from './repository';

export {
  createPlanSchema,
  updatePlanSchema,
  purchasePlanSchema,
} from './validation';
export type {
  CreatePlanInput,
  UpdatePlanInput,
} from './validation';

export {
  plans,
  userSubscriptions,
} from './schema';
export type {
  Plan,
  NewPlan,
  UserSubscription,
  NewUserSubscription,
} from './schema';
