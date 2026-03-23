// src/modules/carrier-bank/controller.ts
import type { RouteHandler } from "fastify";
import { getAuthUserId, handleRouteError } from "@/modules/_shared";
import { upsertBankSchema } from "./validation";
import { repoGetBankByUserId, repoUpsertBank, repoDeleteBank } from "./repository";

export const getMyBank: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const bank = await repoGetBankByUserId(userId);
    return reply.send(bank ?? { iban: "", account_holder: "", bank_name: "", is_verified: 0 });
  } catch (e) {
    return handleRouteError(reply, req, e, "carrier_bank_get");
  }
};

export const upsertMyBank: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const data = upsertBankSchema.parse(req.body);
    const bank = await repoUpsertBank(userId, data);
    return reply.send(bank);
  } catch (e) {
    return handleRouteError(reply, req, e, "carrier_bank_upsert");
  }
};

export const deleteMyBank: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    await repoDeleteBank(userId);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, "carrier_bank_delete");
  }
};
