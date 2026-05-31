// src/modules/purchases/controller.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { getAuthUserId, handleRouteError } from "@/modules/_shared";
import {
  repoPurchaseIlan,
  repoGetRevealForBuyer,
  repoListMyPurchases,
  repoGetCreditBalance,
  repoGetCreditPackages,
  repoListCreditLedger,
} from "./repository";
import { purchaseIlanSchema } from "./validation";

function normalizeIp(req: FastifyRequest) {
  const raw = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ?? req.ip ?? "127.0.0.1";
  return raw === "::1" || raw === "::ffff:127.0.0.1" ? "127.0.0.1" : raw;
}

const ERROR_STATUS: Record<string, number> = {
  not_found: 404,
  own_listing: 400,
  unavailable: 409,
  insufficient_credit: 402,
};

/** POST /ilanlar/:id/satin-al — lead-reveal satın alma (atomik) */
export async function satinAlIlan(req: FastifyRequest, reply: FastifyReply) {
  try {
    const buyerId = getAuthUserId(req);
    const { id } = req.params as { id: string };
    const body = purchaseIlanSchema.parse(req.body);
    const result = await repoPurchaseIlan(id, buyerId, body, normalizeIp(req));
    if (!result.ok) {
      return reply.code(ERROR_STATUS[result.code] ?? 400).send({ error: { message: result.code } });
    }
    return reply.code(201).send({
      purchase_id: result.purchase_id,
      contact: result.contact,
      credit_balance: result.credit_balance,
    });
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_satin_al");
  }
}

/** GET /ilanlar/:id/iletisim — reveal (yalnızca satın alan) */
export async function getIlanIletisim(req: FastifyRequest, reply: FastifyReply) {
  try {
    const buyerId = getAuthUserId(req);
    const { id } = req.params as { id: string };
    const contact = await repoGetRevealForBuyer(id, buyerId);
    if (!contact) return reply.code(402).send({ error: { message: "payment_required" } });
    return reply.send({ contact });
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_iletisim");
  }
}

/** GET /satin-aldiklarim — taşıyıcının açtığı iletişimler */
export async function listSatinAldiklarim(req: FastifyRequest, reply: FastifyReply) {
  try {
    const buyerId = getAuthUserId(req);
    return reply.send({ data: await repoListMyPurchases(buyerId) });
  } catch (e) {
    return handleRouteError(reply, req, e, "satin_aldiklarim");
  }
}

/** GET /ilan-alma-hakki — bakiye + hareketler */
export async function getMyCredits(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const [balance, ledger] = await Promise.all([
      repoGetCreditBalance(userId),
      repoListCreditLedger(userId),
    ]);
    return reply.send({ balance, ledger });
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_alma_hakki");
  }
}

/** GET /ilan-alma-hakki/paketler — admin fiyatlı kontör paketleri */
export async function listCreditPackages(req: FastifyRequest, reply: FastifyReply) {
  try {
    return reply.send({ data: await repoGetCreditPackages() });
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_alma_hakki_paketler");
  }
}
