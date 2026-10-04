import { randomUUID } from 'node:crypto';
import { purchaseTermsAcceptances } from './trust.schema';
import { db } from '@/db/client';

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
export const PURCHASE_TERMS_VERSION = '2026-10-04-v1';

export async function repoRecordTermsAcceptance(tx: Tx, userId: string, flow: 'listing_credit' | 'listing_payment' | 'credit_package', referenceId: string) {
  await tx.insert(purchaseTermsAcceptances).values({
    id: randomUUID(), user_id: userId, flow, reference_id: referenceId,
    terms_version: PURCHASE_TERMS_VERSION,
  });
}
