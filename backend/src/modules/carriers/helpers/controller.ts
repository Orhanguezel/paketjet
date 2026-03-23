// src/modules/carriers/helpers/controller.ts
import { carrierDetailParamsSchema, carrierListQuerySchema } from "../validation";

export function parseCarriersListParams(query: unknown) {
  return carrierListQuerySchema.parse(query ?? {});
}

export function parseCarrierDetailParams(params: unknown) {
  return carrierDetailParamsSchema.parse(params ?? {});
}
