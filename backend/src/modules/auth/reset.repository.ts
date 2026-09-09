import {randomBytes,createHash} from 'node:crypto';
import {hash} from 'argon2';
import {and,eq,sql} from 'drizzle-orm';
import {db} from '@/db/client';
import {users,refresh_tokens} from './schema';
const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
export async function repoCreatePasswordReset(userId:string){
 const token=randomBytes(32).toString('hex');
 await db.update(users).set({reset_token:digest(token),reset_token_expires:new Date(Date.now()+3600000)}).where(and(eq(users.id,userId),eq(users.is_active,1)));
 return token;
}
export async function repoConsumePasswordReset(token:string,password:string){
 if(!/^[a-f0-9]{64}$/.test(token))return null;
 const passwordHash=await hash(password);
 return db.transaction(async tx=>{
  const [user]=await tx.select().from(users).where(eq(users.reset_token,digest(token))).for('update');
  if(!user?.is_active||!user.reset_token_expires||new Date(user.reset_token_expires).getTime()<=Date.now())return null;
  await tx.update(users).set({password_hash:passwordHash,reset_token:null,reset_token_expires:null,auth_version:sql`${users.auth_version}+1`}).where(eq(users.id,user.id));
  await tx.update(refresh_tokens).set({revoked_at:new Date()}).where(eq(refresh_tokens.user_id,user.id));
  return {id:user.id,email:user.email};
 });
}
