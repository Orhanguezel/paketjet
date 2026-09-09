import { randomUUID } from 'node:crypto';
import { db } from '@/db/client';
import { ilanlar } from '@/modules/ilanlar/schema';
import { getTestApp, registerUser, randomEmail } from './setup';
export const declaration = {estimated_value: 1000, estimated_value_currency: 'TRY', content_declared: true} as const;
export async function buyer() {
  const app = await getTestApp();
  const result = await registerUser(app, {email: randomEmail(), password: randomUUID()});
  if (result.status !== 200) throw new Error(`fixture_signup_${result.status}`);
  return {id: result.body.user.id as string, token: result.token!};
}
export async function listing(ownerId: string, status = 'active', days = 2) {
  const id = randomUUID();
  await db.insert(ilanlar).values({id, user_id: ownerId, slug: `test-${id}`, from_city: 'İstanbul', to_city: 'Ankara', departure_date: new Date(Date.now()+days*86400000), total_capacity_kg: '0', available_capacity_kg: '0', price_per_kg: '0', contact_phone: '+905551112233', contact_name: 'Private fixture', contact_email: 'private@example.test', status});
  return id;
}
