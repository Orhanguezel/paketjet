// src/modules/carriers/index.ts
// External module surface for carriers. Keep explicit; no export *.

export { registerCarriersAdmin } from "./admin.routes";

export { adminGetCarrier, adminListCarriers } from "./controller";

export { repoGetCarrierById, repoListCarriers } from "./repository";
export type {
  CarrierDetail,
  CarrierDetailBooking,
  CarrierDetailIlan,
  CarrierDetailRating,
  CarrierDetailStats,
  CarrierListItem,
} from "./repository";

export { carrierDetailParamsSchema, carrierListQuerySchema } from "./validation";
export type { CarrierDetailParams, CarrierListQuery } from "./validation";

export { buildCarriersWhere, parseCarrierDetailParams, parseCarriersListParams } from "./helpers";
export type { CarriersListParams } from "./helpers";
