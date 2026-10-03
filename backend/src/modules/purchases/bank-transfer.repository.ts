import { randomUUID } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { users } from '../auth/schema';
import { repoGetFirstRowByFallback, rowToDto } from '../siteSettings/repository';
import { paymentEvents } from './event.schema';
import { paymentSessions } from './session.schema';
import { creditPackagePurchases, ilanPurchasePayments } from './schema';

const fail = (code: string, statusCode = 409) => Object.assign(new Error(code), { statusCode });
export type BankProvider = 'bank_transfer' | 'bank_test';
export type BankDetails = { iban: string; account_name: string; bank_name: string; description: string };

function validIban(value: string) {
  const iban = value.replace(/\s/g, '').toUpperCase();
  if (!/^TR[0-9]{24}$/.test(iban)) return false;
  const rotated = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rotated) {
    const digits = /[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char;
    for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder === 1;
}

export async function repoBankAvailability(userId: string) {
  const [[user], row] = await Promise.all([
    db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1),
    repoGetFirstRowByFallback('bank_details', ['tr', '*']),
  ]);
  const raw = row ? rowToDto(row).value : null;
  const decoded = typeof raw === 'string' ? (() => { try { return JSON.parse(raw) as unknown; } catch { return null; } })() : raw;
  const value = decoded && typeof decoded === 'object' && !Array.isArray(decoded) ? decoded as Record<string, unknown> : {};
  const details: BankDetails = {
    iban: String(value.iban ?? '').replace(/\s/g, '').toUpperCase(),
    account_name: String(value.account_name ?? '').trim(),
    bank_name: String(value.bank_name ?? '').trim(),
    description: String(value.description ?? '').trim(),
  };
  const real = process.env.BANK_TRANSFER_ENABLED === 'true' && validIban(details.iban) && Boolean(details.account_name && details.bank_name);
  const allowlist = (process.env.BANK_TRANSFER_TEST_EMAILS ?? '').split(',').map(email => email.trim().toLowerCase());
  const test = process.env.BANK_TRANSFER_TEST_MODE === 'true' && Boolean(user?.email && allowlist.includes(user.email.toLowerCase()));
  if (test) return { enabled: true, mode: 'test' as const, provider: 'bank_test' as const, bank_details: null };
  if (real) return { enabled: true, mode: 'real' as const, provider: 'bank_transfer' as const, bank_details: details };
  return { enabled: false, mode: null, provider: null, bank_details: null };
}

export async function repoBankOrder(ref: string, userId: string) {
  const [row] = await db.select().from(paymentSessions).where(and(eq(paymentSessions.payment_ref, ref), eq(paymentSessions.user_id, userId))).limit(1);
  return row?.provider === 'bank_test' || row?.provider === 'bank_transfer' ? row : null;
}

export async function repoReportBankTransfer(ref: string, userId: string) {
  return db.transaction(async tx => {
    const [row] = await tx.select().from(paymentSessions).where(and(eq(paymentSessions.payment_ref, ref), eq(paymentSessions.user_id, userId))).for('update');
    if (!row || !['bank_test', 'bank_transfer'].includes(row.provider)) throw fail('payment_not_found', 404);
    if (row.state === 'review') return { ok: true, state: 'review' };
    if (row.state !== 'pending' || new Date(row.expires_at).getTime() <= Date.now()) throw fail('payment_not_pending');
    await tx.update(paymentSessions).set({ state: 'review' }).where(eq(paymentSessions.payment_ref, ref));
    await tx.insert(paymentEvents).values({ id: randomUUID(), payment_ref: ref, actor_id: userId, event: 'bank_reported', note: row.provider === 'bank_test' ? 'test_only' : null });
    return { ok: true, state: 'review' };
  });
}

export async function repoRejectBankTransfer(ref: string, actorId: string, reason: string) {
  return db.transaction(async tx => {
    const [row] = await tx.select().from(paymentSessions).where(eq(paymentSessions.payment_ref, ref)).for('update');
    if (!row || !['bank_test', 'bank_transfer'].includes(row.provider)) throw fail('payment_not_found', 404);
    if (!['pending', 'review'].includes(row.state)) throw fail('payment_not_reviewable');
    await tx.update(paymentSessions).set({ state: 'failed', error_code: 'bank_rejected' }).where(eq(paymentSessions.payment_ref, ref));
    if (row.kind === 'credits') await tx.update(creditPackagePurchases).set({ status: 'failed' }).where(eq(creditPackagePurchases.payment_ref, ref));
    if (row.kind === 'listing') await tx.update(ilanPurchasePayments).set({ status: 'failed' }).where(eq(ilanPurchasePayments.payment_ref, ref));
    await tx.insert(paymentEvents).values({ id: randomUUID(), payment_ref: ref, actor_id: actorId, event: 'bank_rejected', note: reason });
    return { ok: true };
  });
}
