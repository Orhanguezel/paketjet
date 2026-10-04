// src/modules/partner-api/controller.ts — Partner API v1: firmanin kendi ilanlari.
// Ilan kurallari ilanlar modulunden gelir (dogrulama, onay akisi, durum gecisleri); burada yeniden yazilmaz.
import type { FastifyReply, FastifyRequest } from 'fastify';
import { getAuthUserId, handleRouteError, isDuplicateError } from '@/modules/_shared';
import { buildIlanPatch, createIlanInsertPayload, repoCreateIlan, repoDeleteIlan, repoUpdateIlan, repoUpdateIlanStatus } from '@/modules/ilanlar';
import { toPartnerListing } from './dto';
import { repoCountOpenListings, repoPartnerListing, repoPartnerListingByRef, repoPartnerListings } from './repository';
import { MAX_OPEN_LISTINGS, partnerCreateSchema, partnerListSchema, partnerStatusSchema, partnerUpdateSchema } from './validation';

const notFound = (reply: FastifyReply) => reply.code(404).send({ error: { code: 'not_found', message: 'İlan bulunamadı.' } });

async function own(req: FastifyRequest) {
  return repoPartnerListing(getAuthUserId(req), (req.params as { id: string }).id);
}

export async function partnerList(req: FastifyRequest, reply: FastifyReply) {
  try {
    const q = partnerListSchema.parse(req.query ?? {});
    const { rows, total } = await repoPartnerListings(getAuthUserId(req), { status: q.status, external_ref: q.external_ref, limit: q.limit, offset: (q.page - 1) * q.limit });
    return reply.send({ data: rows.map(toPartnerListing), page: q.page, limit: q.limit, total });
  } catch (e) { return handleRouteError(reply, req, e, 'partner_list'); }
}

export async function partnerGet(req: FastifyRequest, reply: FastifyReply) {
  try { const row = await own(req); return row ? reply.send(toPartnerListing(row)) : notFound(reply); }
  catch (e) { return handleRouteError(reply, req, e, 'partner_get'); }
}

/** Ayni external_ref ile tekrar gelen istek yeni ilan ACMAZ; mevcut ilan 200 + Idempotent-Replay ile doner. */
export async function partnerCreate(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const body = partnerCreateSchema.parse(req.body ?? {});
    const ref = body.external_ref;
    if (ref) {
      const existing = await repoPartnerListingByRef(userId, ref);
      if (existing) return reply.header('idempotent-replay', 'true').send(toPartnerListing(existing));
    }
    if ((await repoCountOpenListings(userId)) >= MAX_OPEN_LISTINGS) {
      return reply.code(429).send({ error: { code: 'open_listing_limit', message: `En fazla ${MAX_OPEN_LISTINGS} açık ilan olabilir.` } });
    }
    try {
      const created = await repoCreateIlan(userId, { ...createIlanInsertPayload(body), external_ref: ref ?? null });
      const row = created ? await repoPartnerListing(userId, created.id) : null;
      req.log.info({ event: 'partner_listing_created', userId, ilanId: created?.id, externalRef: ref }, 'partner_listing_created');
      return reply.code(201).send(row ? toPartnerListing(row) : created);
    } catch (e) {
      if (ref && isDuplicateError(e)) {
        const existing = await repoPartnerListingByRef(userId, ref);
        if (existing) return reply.header('idempotent-replay', 'true').send(toPartnerListing(existing));
      }
      throw e;
    }
  } catch (e) { return handleRouteError(reply, req, e, 'partner_create'); }
}

export async function partnerUpdate(req: FastifyRequest, reply: FastifyReply) {
  try {
    const row = await own(req);
    if (!row) return notFound(reply);
    await repoUpdateIlan(row.id, buildIlanPatch(partnerUpdateSchema.parse(req.body ?? {})), false, getAuthUserId(req));
    return reply.send(toPartnerListing((await own(req))!));
  } catch (e) { return handleRouteError(reply, req, e, 'partner_update'); }
}

export async function partnerStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const row = await own(req);
    if (!row) return notFound(reply);
    await repoUpdateIlanStatus(row.id, partnerStatusSchema.parse(req.body ?? {}).status, false, getAuthUserId(req));
    return reply.send(toPartnerListing((await own(req))!));
  } catch (e) { return handleRouteError(reply, req, e, 'partner_status'); }
}

export async function partnerDelete(req: FastifyRequest, reply: FastifyReply) {
  try {
    const row = await own(req);
    if (!row) return notFound(reply);
    await repoDeleteIlan(row.id);
    return reply.send({ ok: true });
  } catch (e) { return handleRouteError(reply, req, e, 'partner_delete'); }
}
