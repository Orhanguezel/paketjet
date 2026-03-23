// src/modules/subscription/helpers/admin.ts
import type { NewPlan } from "../schema";
import type { CreatePlanInput, UpdatePlanInput } from "../validation";

export function createAdminPlanInsert(body: CreatePlanInput): Omit<NewPlan, "id"> {
  return {
    name: body.name,
    slug: body.slug,
    price: String(body.price),
    ilan_limit: body.ilan_limit,
    duration_days: body.duration_days,
    features: body.features,
    sort_order: body.sort_order,
    is_active: body.is_active,
  };
}

export function buildAdminPlanPatch(body: UpdatePlanInput): Partial<NewPlan> {
  const patch: Partial<NewPlan> = {};

  if (body.name !== undefined) patch.name = body.name;
  if (body.slug !== undefined) patch.slug = body.slug;
  if (body.price !== undefined) patch.price = String(body.price);
  if (body.ilan_limit !== undefined) patch.ilan_limit = body.ilan_limit;
  if (body.duration_days !== undefined) patch.duration_days = body.duration_days;
  if (body.features !== undefined) patch.features = body.features;
  if (body.sort_order !== undefined) patch.sort_order = body.sort_order;
  if (body.is_active !== undefined) patch.is_active = body.is_active;

  return patch;
}
