// src/modules/partner-api/keys.ts
// Anahtar bicimi: pj_live_<43 karakter base64url> (256 bit). Yalniz SHA-256 ozeti saklanir;
// anahtarin kendisi bir kez, olusturulurken gosterilir. Yuksek entropili oldugu icin yavas hash gerekmez.
import { createHash, randomBytes } from 'crypto';

export const KEY_PREFIX = 'pj_live_';
export const hashApiKey = (key: string) => createHash('sha256').update(key).digest('hex');
export function generateApiKey() {
  const key = KEY_PREFIX + randomBytes(32).toString('base64url');
  return { key, prefix: key.slice(0, KEY_PREFIX.length + 6), hash: hashApiKey(key) };
}
/** Authorization: Bearer pj_live_… veya X-API-Key: pj_live_… */
export function readApiKey(headers: Record<string, string | string[] | undefined>) {
  const auth = typeof headers.authorization === 'string' ? headers.authorization : '';
  const raw = auth.startsWith('Bearer ') ? auth.slice(7).trim() : typeof headers['x-api-key'] === 'string' ? headers['x-api-key'].trim() : '';
  return raw.startsWith(KEY_PREFIX) && raw.length <= 80 ? raw : null;
}
