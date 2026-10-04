import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { ilanlar } from '../ilanlar/schema';
import { repoGetCreditBalance, repoGetRevealForBuyer } from './repository';
export async function repoListingAccess(id: string, userId: string) {
  const [row] = await db.select().from(ilanlar).where(eq(ilanlar.id,id));
  if (!row) return null;
  const [contact,balance]=await Promise.all([repoGetRevealForBuyer(id,userId),repoGetCreditBalance(userId)]);
  const isOwner=row.user_id===userId;
  const available=row.status==='active' && new Date(row.departure_date).getTime()>Date.now();
  return {is_owner:isOwner, contact, balance, state:contact?'purchased':isOwner?'owner':!available?'unavailable':balance>0?'credit':'card'};
}
