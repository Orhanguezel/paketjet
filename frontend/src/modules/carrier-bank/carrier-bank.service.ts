import { apiGet, apiPut, apiDelete } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { CarrierBankAccount } from "./carrier-bank.type";
import type { CarrierBankFormData } from "./carrier-bank.schema";

export const getMyBank = () =>
  apiGet<CarrierBankAccount>(API.carrierBank.get);

export const upsertMyBank = (data: CarrierBankFormData) =>
  apiPut<CarrierBankAccount>(API.carrierBank.upsert, data);

export const deleteMyBank = () =>
  apiDelete<{ ok: true }>(API.carrierBank.delete);
