// src/modules/storage/remote-avatar.service.ts
// Saglayici profil fotografini (Google) kullanicinin avatar klasorune KOPYALAR.
// Uzak adres dogrudan kullanilmaz: degisebilir/suresi dolabilir ve her goruntulemede kullanici
// IP'si ucuncu tarafa gider. Yalniz bilinen https kaynaklari, en fazla 5 MB resim.
import { randomUUID } from 'node:crypto';
import { getCloudinaryConfig, uploadBufferAuto } from './cloudinary';
import { repoInsert, type StorageInsertInput } from './repository';
import { buildPublicUrl } from './util';

const ALLOWED_HOSTS = /^([a-z0-9-]+\.)*googleusercontent\.com$/i;
const MIME = /^image\/(png|jpeg|webp)$/;
const MAX_BYTES = 5 * 1024 * 1024;

export async function storeRemoteAvatar(userId: string, sourceUrl: string): Promise<string | null> {
  const url = new URL(sourceUrl);
  if (url.protocol !== 'https:' || !ALLOWED_HOSTS.test(url.hostname)) return null;
  const cfg = await getCloudinaryConfig();
  if (!cfg) return null;
  const res = await fetch(url, { signal: AbortSignal.timeout(5000), redirect: 'error' });
  const mime = (res.headers.get('content-type') ?? '').split(';')[0]!.trim().toLowerCase();
  if (!res.ok || !MIME.test(mime) || Number(res.headers.get('content-length') ?? 0) > MAX_BYTES) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (!buf.length || buf.length > MAX_BYTES) return null;
  const folder = `avatars/${userId}`;
  const up = await uploadBufferAuto(cfg, buf, { folder, publicId: `${randomUUID()}-google`, mime });
  const record: StorageInsertInput = {
    id: randomUUID(), user_id: userId, name: 'google-avatar', bucket: 'avatars', path: up.public_id, folder,
    mime, size: typeof up.bytes === 'number' ? up.bytes : buf.length,
    width: typeof up.width === 'number' ? up.width : null, height: typeof up.height === 'number' ? up.height : null,
    url: up.secure_url || null, hash: up.etag ?? null, etag: up.etag ?? null,
    provider: cfg.driver === 'local' ? 'local' : 'cloudinary', provider_public_id: up.public_id ?? null,
    provider_resource_type: up.resource_type ?? null, provider_format: up.format ?? null,
    provider_version: typeof up.version === 'number' ? up.version : null, metadata: null,
  } as StorageInsertInput;
  await repoInsert(Object.fromEntries(Object.entries(record).filter(([, v]) => v !== null && v !== undefined)) as StorageInsertInput);
  return buildPublicUrl('avatars', up.public_id, up.secure_url, cfg);
}
