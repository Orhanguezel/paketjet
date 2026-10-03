// src/modules/identity/controller.ts
// Kullanicinin kendi kimlik on/arka yuzu — yukle / goster / sil. DB sorgusu yok.
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { MultipartFile } from '@fastify/multipart';
import { randomUUID } from 'crypto';
import { getAuthUserId, handleRouteError } from '@/modules/_shared';
import { validateUpload } from '@/modules/storage/upload-policy';
import { repoDeleteIdentitySide, repoGetIdentityDocuments, repoGetIdentitySide, repoUpsertIdentitySide, type IdentitySide } from './repository';
import { removeIdentityFile, writeIdentityFile } from './file-store';
import { sendIdentityImage, toIdentityDto } from './helpers';
import { IDENTITY_MAX_BYTES, IDENTITY_MIMES } from './validation';

type FileRequest = FastifyRequest & { file?: () => Promise<MultipartFile | undefined> };
const invalidFile = (reply: FastifyReply) => reply.code(400).send({ error: { message: 'invalid_identity_file' } });
function sideOf(req: FastifyRequest): IdentitySide {
  const side = (req.params as { side: string }).side;
  if (side !== 'front' && side !== 'back') throw Object.assign(new Error('invalid_identity_side'), { statusCode: 400 });
  return side;
}

/** GET /identity/me */
export async function getMyIdentity(req: FastifyRequest, reply: FastifyReply) {
  try {
    return reply.header('cache-control', 'no-store').send(toIdentityDto(await repoGetIdentityDocuments(getAuthUserId(req))));
  } catch (e) {
    return handleRouteError(reply, req, e, 'identity_get');
  }
}

/** GET /identity/me/:side — gorselin kendisi */
export async function getMyIdentitySide(req: FastifyRequest, reply: FastifyReply) {
  try {
    return sendIdentityImage(reply, await repoGetIdentitySide(getAuthUserId(req), sideOf(req)));
  } catch (e) {
    return handleRouteError(reply, req, e, 'identity_side_get');
  }
}

/** POST /identity/me/:side (multipart, alan: file) */
export async function uploadMyIdentitySide(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const side = sideOf(req);
    let mp: MultipartFile | undefined;
    try {
      mp = await (req as FileRequest).file?.();
    } catch {
      return invalidFile(reply);
    }
    if (!mp || !(IDENTITY_MIMES as readonly string[]).includes(mp.mimetype)) return invalidFile(reply);
    const buf = await mp.toBuffer();
    if (buf.length > IDENTITY_MAX_BYTES) return invalidFile(reply);
    try {
      validateUpload(buf, mp.mimetype);
    } catch {
      return invalidFile(reply);
    }
    const fileId = randomUUID();
    const filePath = await writeIdentityFile(userId, fileId, mp.mimetype, buf);
    let result: Awaited<ReturnType<typeof repoUpsertIdentitySide>>;
    try {
      result = await repoUpsertIdentitySide(side, { id: fileId, user_id: userId, file_path: filePath, mime: mp.mimetype, size: buf.length });
    } catch (e) {
      await removeIdentityFile(filePath).catch(() => undefined);
      throw e;
    }
    const { previousPath, documents } = result;
    if (previousPath && previousPath !== filePath) {
      await removeIdentityFile(previousPath).catch((err) => req.log.warn({ err, event: 'identity_old_file_remove_failed' }, 'identity_old_file_remove_failed'));
    }
    req.log.info({ event: 'identity_side_uploaded', userId, side, size: buf.length }, 'identity_side_uploaded');
    return reply.send(toIdentityDto(documents));
  } catch (e) {
    return handleRouteError(reply, req, e, 'identity_side_upload');
  }
}

/** DELETE /identity/me/:side */
export async function deleteMyIdentitySide(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const side = sideOf(req);
    const row = await repoGetIdentitySide(userId, side);
    if (row) {
      await repoDeleteIdentitySide(userId, side);
      await removeIdentityFile(row.file_path).catch((err) => req.log.warn({ err, event: 'identity_file_remove_failed' }, 'identity_file_remove_failed'));
      req.log.info({ event: 'identity_side_deleted', userId, side }, 'identity_side_deleted');
    }
    return reply.send(toIdentityDto(await repoGetIdentityDocuments(userId)));
  } catch (e) {
    return handleRouteError(reply, req, e, 'identity_side_delete');
  }
}
