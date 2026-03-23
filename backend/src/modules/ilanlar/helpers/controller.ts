// src/modules/ilanlar/helpers/controller.ts
import { parsePage } from "@/modules/_shared";
import type { repoUpdateIlan } from "../repository";
import type { z } from "zod";
import type { createIlanSchema, updateIlanSchema } from "../validation";

type CreateIlanInput = z.infer<typeof createIlanSchema>;
type UpdateIlanInput = z.infer<typeof updateIlanSchema>;
type IlanPatch = Parameters<typeof repoUpdateIlan>[1];

export function createIlanInsertPayload(body: CreateIlanInput) {
  return {
    from_city: body.from_city,
    to_city: body.to_city,
    from_district: body.from_district ?? null,
    to_district: body.to_district ?? null,
    departure_date: new Date(body.departure_date),
    arrival_date: body.arrival_date ? new Date(body.arrival_date) : null,
    total_capacity_kg: String(body.total_capacity_kg),
    price_per_kg: String(body.price_per_kg),
    currency: body.currency,
    is_negotiable: body.is_negotiable ?? 0,
    vehicle_type: body.vehicle_type ?? "car",
    title: body.title ?? null,
    description: body.description ?? null,
    contact_phone: body.contact_phone,
    contact_email: body.contact_email ?? null,
    status: "active" as const,
  };
}

export function buildIlanPatch(body: UpdateIlanInput): IlanPatch {
  const patch: IlanPatch = {};

  if (body.from_city !== undefined) patch.from_city = body.from_city;
  if (body.to_city !== undefined) patch.to_city = body.to_city;
  if (body.from_district !== undefined) patch.from_district = body.from_district ?? null;
  if (body.to_district !== undefined) patch.to_district = body.to_district ?? null;
  if (body.departure_date !== undefined) patch.departure_date = new Date(body.departure_date);
  if (body.arrival_date !== undefined) patch.arrival_date = body.arrival_date ? new Date(body.arrival_date) : null;
  if (body.total_capacity_kg !== undefined) patch.total_capacity_kg = String(body.total_capacity_kg);
  if (body.price_per_kg !== undefined) patch.price_per_kg = String(body.price_per_kg);
  if (body.currency !== undefined) patch.currency = body.currency;
  if (body.is_negotiable !== undefined) patch.is_negotiable = body.is_negotiable;
  if (body.vehicle_type !== undefined) patch.vehicle_type = body.vehicle_type;
  if (body.title !== undefined) patch.title = body.title ?? null;
  if (body.description !== undefined) patch.description = body.description ?? null;
  if (body.contact_phone !== undefined) patch.contact_phone = body.contact_phone;
  if (body.contact_email !== undefined) patch.contact_email = body.contact_email ?? null;

  return patch;
}

export function parseAdminIlanListParams(query: Record<string, string>) {
  const { page, limit, offset } = parsePage(query);

  return {
    page,
    limit,
    offset,
    status: query.status,
    user_id: query.user_id,
    from_city: query.from_city,
    to_city: query.to_city,
  };
}

export function parseAdminCarriersListParams(query: Record<string, string>) {
  const { page, limit, offset } = parsePage(query);

  return { page, limit, offset };
}
