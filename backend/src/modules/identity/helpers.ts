// src/modules/identity/helpers.ts
import type { FastifyReply } from 'fastify';
import type { IdentityDocumentRow } from './schema';
import { readIdentityFile } from './file-store';

/** Dosya yolu istemciye ASLA gitmez; yalniz durum bilgisi. */
export function toIdentityDto(row: IdentityDocumentRow | null) {
  if (!row) return { front: null };
  return {
    front: {
      status: row.status,
      reject_reason: row.reject_reason,
      reviewed_at: row.reviewed_at,
      uploaded_at: row.updated_at,
      version: new Date(row.updated_at).getTime(),
    },
  };
}

/** Kimlik gorselini cache'lenmeyecek, indirilmeyecek sekilde gonderir. */
export async function sendIdentityImage(reply: FastifyReply, row: IdentityDocumentRow | null) {
  const buf = row ? await readIdentityFile(row.file_path) : null;
  if (!row || !buf) return reply.code(404).send({ error: { message: 'not_found' } });
  return reply
    .header('content-type', row.mime)
    .header('cache-control', 'private, no-store, max-age=0')
    .header('x-content-type-options', 'nosniff')
    .header('content-disposition', 'inline')
    .header('x-robots-tag', 'noindex, nofollow')
    .send(buf);
}
