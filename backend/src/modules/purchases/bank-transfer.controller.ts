import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { getAuthUserId, handleRouteError, repoInvalidateDashboardCache } from '@/modules/_shared';
import { repoBankAvailability, repoBankOrder, repoRejectBankTransfer, repoReportBankTransfer } from './bank-transfer.repository';
import { repoCreateCreditPackagePayment, repoCompleteCreditPackagePayment } from './credit-payment.repository';
import { repoCreateIlanPayment, repoCompleteIlanPayment } from './listing-payment.repository';
import { repoPaymentByRef } from './session.repository';
import { purchaseDeclarationSchema } from './validation';
import { APP_NAME } from '@/core/brand';

const refParam = z.object({ ref: z.string().uuid() });
const bankUnavailable = () => Object.assign(new Error('bank_transfer_unavailable'), { statusCode: 503 });
const orderResponse = (ref: string, amount: number, policy: Awaited<ReturnType<typeof repoBankAvailability>>) => ({
  provider: policy.provider, mode: policy.mode, conversationId: ref, amount,
  bank_details: policy.bank_details, transfer_description: APP_NAME ? `${APP_NAME} ${ref}` : ref,
});

export async function getBankAvailability(req: FastifyRequest, reply: FastifyReply) {
  try { return reply.header('Cache-Control', 'private, no-store').send(await repoBankAvailability(getAuthUserId(req))); }
  catch (error) { return handleRouteError(reply, req, error, 'bank_availability'); }
}

export async function createBankCreditOrder(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const { package_key } = z.object({ package_key: z.string().min(1).max(80) }).strict().parse(req.body);
    const policy = await repoBankAvailability(userId);
    if (!policy.enabled || !policy.provider) throw bankUnavailable();
    const result = await repoCreateCreditPackagePayment(userId, package_key, policy.provider);
    if (!result.ok) return reply.code(result.code === 'user_not_found' ? 404 : 400).send({ error: { message: result.code } });
    return reply.code(201).send(orderResponse(result.purchase.payment_ref, Number(result.purchase.price), policy));
  } catch (error) { return handleRouteError(reply, req, error, 'bank_credit_order'); }
}

export async function createBankListingOrder(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const { id } = req.params as { id: string };
    const body = purchaseDeclarationSchema.strict().parse(req.body);
    const policy = await repoBankAvailability(userId);
    if (!policy.enabled || !policy.provider) throw bankUnavailable();
    const result = await repoCreateIlanPayment(id, userId, policy.provider, body, req.ip);
    if (!result.ok) return reply.code(result.code === 'user_not_found' ? 404 : result.code === 'listing_not_found' ? 404 : 409).send({ error: { message: result.code } });
    return reply.code(201).send(orderResponse(result.payment.payment_ref, result.price, policy));
  } catch (error) { return handleRouteError(reply, req, error, 'bank_listing_order'); }
}

export async function reportBankTransfer(req: FastifyRequest, reply: FastifyReply) {
  try { return reply.send(await repoReportBankTransfer(refParam.parse(req.params).ref, getAuthUserId(req))); }
  catch (error) { return handleRouteError(reply, req, error, 'bank_report'); }
}

export async function getBankOrder(req: FastifyRequest, reply: FastifyReply) {
  try {
    const row = await repoBankOrder(refParam.parse(req.params).ref, getAuthUserId(req));
    if (!row) return reply.code(404).send({ error: { message: 'payment_not_found' } });
    const policy = await repoBankAvailability(getAuthUserId(req));
    const details = row.provider === 'bank_transfer' && policy.mode === 'real' ? policy.bank_details : null;
    return reply.header('Cache-Control', 'private, no-store').send({ provider: row.provider, mode: row.provider === 'bank_test' ? 'test' : 'real', amount: row.amount, state: row.state, expires_at: row.expires_at, bank_details: details, transfer_description: APP_NAME ? `${APP_NAME} ${row.payment_ref}` : row.payment_ref });
  } catch (error) { return handleRouteError(reply, req, error, 'bank_order'); }
}

const approveBody = z.object({ amount: z.coerce.number().positive(), transaction_id: z.string().trim().min(6).max(100).optional(), confirmed_on_statement: z.literal(true) }).strict();
export async function approveBankTransfer(req: FastifyRequest, reply: FastifyReply) {
  try {
    const actorId = getAuthUserId(req), ref = refParam.parse(req.params).ref;
    const body = approveBody.parse(req.body);
    const row = await repoPaymentByRef(ref);
    if (!row || !['bank_test', 'bank_transfer'].includes(row.provider)) return reply.code(404).send({ error: { message: 'payment_not_found' } });
    if (row.state !== 'review') return reply.code(409).send({ error: { message: 'payment_not_in_review' } });
    if (row.provider === 'bank_transfer' && !body.transaction_id) return reply.code(400).send({ error: { message: 'transaction_id_required' } });
    if (row.provider === 'bank_test' && process.env.BANK_TRANSFER_TEST_MODE !== 'true') throw bankUnavailable();
    const paymentId = row.provider === 'bank_test' ? `TEST-${ref}` : body.transaction_id!;
    const proof = { provider: row.provider, amount: body.amount, currency: 'TRY', paymentId, actorId };
    const result = row.kind === 'credits' ? await repoCompleteCreditPackagePayment(ref, proof) : row.kind === 'listing' ? await repoCompleteIlanPayment(ref, proof) : { ok: false, code: 'unsupported_kind' };
    if (!result.ok) return reply.code(result.code === 'unavailable' || result.code === 'review_required' ? 409 : 400).send({ error: { message: result.code } });
    await repoInvalidateDashboardCache([row.user_id]);
    return reply.send({ ok: true, already_processed: 'already_processed' in result ? result.already_processed : false });
  } catch (error) { return handleRouteError(reply, req, error, 'bank_approval'); }
}

export async function rejectBankTransfer(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { reason } = z.object({ reason: z.string().trim().min(10).max(1000) }).strict().parse(req.body);
    return reply.send(await repoRejectBankTransfer(refParam.parse(req.params).ref, getAuthUserId(req), reason));
  } catch (error) { return handleRouteError(reply, req, error, 'bank_rejection'); }
}
