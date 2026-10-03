// src/modules/identity/controller.ts
// Kullanicinin kendi kimlik on yuzu — yukle / goster / sil. DB sorgusu yok.
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { MultipartFile } from '@fastify/multipart';
import { randomUUID } from 'crypto';
import { getAuthUserId, handleRouteError } from '@/modules/_shared';
import { validateUpload } from '@/modules/storage/upload-policy';
import { repoDeleteIdentityFront, repoGetIdentityFront, repoUpsertIdentityFront } from './repository';
import { removeIdentityFile, writeIdentityFile } from './file-store';
import { sendIdentityImage, toIdentityDto } from './helpers';
import { IDENTITY_MAX_BYTES, IDENTITY_MIMES } from './validation';

type FileRequest = FastifyRequest & { file?: () => Promise<MultipartFile | undefined> };
const invalidFile = (reply: FastifyReply) => reply.code(400).send({ error: { message: 'invalid_identity_file' } });

/** GET /identity/me */
export async function getMyIdentity(req: FastifyRequest, reply: FastifyReply) {
  try {
    return reply.header('cache-control', 'no-store').send(toIdentityDto(await repoGetIdentityFront(getAuthUserId(req))));
  } catch (e) {
    return handleRouteError(reply, req, e, 'identity_get');
  }
}

/** GET /identity/me/front — gorselin kendisi */
export async function getMyIdentityFront(req: FastifyRequest, reply: FastifyReply) {
  try {
    return sendIdentityImage(reply, await repoGetIdentityFront(getAuthUserId(req)));
  } catch (e) {
    return handleRouteError(reply, req, e, 'identity_front_get');
  }
}

/** POST /identity/me/front (multipart, alan: file) */
export async function uploadMyIdentityFront(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
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
    const { previousPath, row } = await repoUpsertIdentityFront({ id: fileId, user_id: userId, file_path: filePath, mime: mp.mimetype, size: buf.length });
    if (previousPath && previousPath !== filePath) {
      await removeIdentityFile(previousPath).catch((err) => req.log.warn({ err, event: 'identity_old_file_remove_failed' }, 'identity_old_file_remove_failed'));
    }
    req.log.info({ event: 'identity_front_uploaded', userId, size: buf.length }, 'identity_front_uploaded');
    return reply.send(toIdentityDto(row));
  } catch (e) {
    return handleRouteError(reply, req, e, 'identity_front_upload');
  }
}

/** DELETE /identity/me/front */
export async function deleteMyIdentityFront(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = getAuthUserId(req);
    const row = await repoGetIdentityFront(userId);
    if (row) {
      await repoDeleteIdentityFront(userId);
      await removeIdentityFile(row.file_path).catch((err) => req.log.warn({ err, event: 'identity_file_remove_failed' }, 'identity_file_remove_failed'));
      req.log.info({ event: 'identity_front_deleted', userId }, 'identity_front_deleted');
    }
    return reply.send({ front: null });
  } catch (e) {
    return handleRouteError(reply, req, e, 'identity_front_delete');
  }
}
