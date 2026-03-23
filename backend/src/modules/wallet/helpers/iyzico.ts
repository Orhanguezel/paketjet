// src/modules/wallet/helpers/iyzico.ts
// Local helpers for Iyzico integration

import { createHash, randomBytes } from 'node:crypto';
import { env } from '@/core/env';

export function buildIyzicoAuthHeader(body: object): { Authorization: string; 'x-iyzi-rnd': string } {
  const { IYZICO_API_KEY: apiKey, IYZICO_SECRET_KEY: secretKey } = env;
  const randomString = randomBytes(6).toString('base64url').slice(0, 8);
  const hashInput = apiKey + randomString + secretKey + JSON.stringify(body);
  const hash = createHash('sha256').update(hashInput, 'utf8').digest('base64');
  return {
    Authorization: `IYZWS ${apiKey}:${hash}`,
    'x-iyzi-rnd': randomString,
  };
}
