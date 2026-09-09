// src/modules/ilanlar/controller.ts
import type { RouteHandler } from "fastify";
import {
  CACHE_TTL,
  cacheKeys,
  getAuthUserId,
  handleRouteError,
  repoGetCacheJson,
  repoSetCacheJson,
  sendNotFound,
  sendForbidden,
} from "@/modules/_shared";
import {
  createIlanSchema,
  updateIlanSchema,
  searchIlansSchema,
  updateIlanStatusSchema,
} from "./validation";
import { buildIlanPatch, createIlanInsertPayload } from "./helpers";
import {
  repoGetIlanById,
  repoGetIlanBySlugOrId,
  repoListIlans,
  repoCreateIlan,
  repoUpdateIlan,
  repoUpdateIlanStatus,
  repoDeleteIlan,
  repoGetUserIlans,
} from "./repository";


// ── Public ───────────────────────────────────────────────────────────────────

export const listIlans: RouteHandler = async (req, reply) => {
  try {
    const filters = searchIlansSchema.parse(req.query ?? {});
    const cacheKey = `public-v2:${cacheKeys.ilanList(filters)}`;
    const cached = await repoGetCacheJson<Awaited<ReturnType<typeof repoListIlans>>>(cacheKey);
    if (cached) {
      reply.header("x-total-count", String(cached.total));
      return reply.send(cached);
    }

    const result = await repoListIlans(filters);
    await repoSetCacheJson(cacheKey, result, CACHE_TTL.ilanList);
    reply.header("x-total-count", String(result.total));
    return reply.send(result);
  } catch (e) {
    return handleRouteError(reply, req, e, "ilanlar_list_failed");
  }
};

export const getIlan: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const cacheKey = `public-v2:${cacheKeys.ilanDetail(id)}`;
    const cached = await repoGetCacheJson<Awaited<ReturnType<typeof repoGetIlanById>>>(cacheKey);
    if (cached) return reply.send(cached);

    // Slug veya UUID ile sorgula
    const ilan = await repoGetIlanBySlugOrId(id);
    if (!ilan) return sendNotFound(reply);
    await repoSetCacheJson(cacheKey, ilan, CACHE_TTL.ilanDetail);
    return reply.send(ilan);
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_get_failed");
  }
};

// ── Auth Korumalı ────────────────────────────────────────────────────────────

export const listMyIlans: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    return reply.send(await repoGetUserIlans(userId));
  } catch (e) {
    return handleRouteError(reply, req, e, "my_ilanlar_failed");
  }
};

export const createIlan: RouteHandler = async (req, reply) => {
  try {
    const userId = getAuthUserId(req);
    const body = createIlanSchema.parse(req.body ?? {});

    // KYC kaldirildi (2026-05-30): kimseye payout yok -> dogrulama gereksiz.
    // Ilan acmak ucretsiz; kargo bedeli/icerik beyani satin alma akışında alınır.

    const ilan = await repoCreateIlan(userId, createIlanInsertPayload(body));
    return reply.code(201).send(ilan);
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_create_failed");
  }
};

export const updateIlan: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const userId = getAuthUserId(req);
    const body = updateIlanSchema.parse(req.body ?? {});

    const existing = await repoGetIlanById(id);
    if (!existing) return sendNotFound(reply);
    if (existing.user_id !== userId) return sendForbidden(reply);

    return reply.send(await repoUpdateIlan(id, buildIlanPatch(body)));
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_update_failed");
  }
};

export const updateStatus: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const userId = getAuthUserId(req);
    const { status } = updateIlanStatusSchema.parse(req.body ?? {});
    const existing = await repoGetIlanById(id);
    if (!existing) return sendNotFound(reply);
    if (existing.user_id !== userId) return sendForbidden(reply);
    return reply.send(await repoUpdateIlanStatus(id, status));
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_status_update_failed");
  }
};

export const deleteIlan: RouteHandler = async (req, reply) => {
  const { id } = req.params as { id: string };
  try {
    const userId = getAuthUserId(req);
    const existing = await repoGetIlanById(id);
    if (!existing) return sendNotFound(reply);
    if (existing.user_id !== userId) return sendForbidden(reply);
    await repoDeleteIlan(id);
    return reply.send({ ok: true });
  } catch (e) {
    return handleRouteError(reply, req, e, "ilan_delete_failed");
  }
};
