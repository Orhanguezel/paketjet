import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/db/client';
import { wallets, walletTransactions } from './schema';
export async function repoLegacyWallet(userId:string){
  const [row]=await db.select().from(wallets).where(eq(wallets.user_id,userId)).limit(1);
  return row?{...row,unit:'TRY',model:'legacy_archive',read_only:true}:{user_id:userId,balance:'0.00',currency:'TRY',unit:'TRY',model:'legacy_archive',read_only:true};
}
export async function repoLegacyTransactions(userId:string,page:number,limit:number){
  const where=eq(walletTransactions.user_id,userId);
  const [data,[count]]=await Promise.all([db.select().from(walletTransactions).where(where).orderBy(desc(walletTransactions.created_at)).limit(limit).offset((page-1)*limit),db.select({total:sql<number>`COUNT(*)`}).from(walletTransactions).where(where)]);
  return {data,total:Number(count?.total??0),page,limit,unit:'TRY',read_only:true};
}
