// src/modules/identity/file-store.ts
// Kimlik gorselleri icin OZEL disk deposu. Statik olarak servis edilen uploads kokunden ayridir;
// dosyaya yalniz yetkili controller'lar uzerinden erisilir.
import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '@/core/env';
import { safeStoragePath } from '@/modules/storage/upload-policy';

const EXT: Record<string, string> = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

function privateRoot(): string {
  return path.resolve(env.PRIVATE_STORAGE_ROOT || path.join(process.cwd(), 'private-uploads'));
}

export async function writeIdentityFile(userId: string, fileId: string, mime: string, buf: Buffer): Promise<string> {
  const relative = `identity/${userId}/${fileId}${EXT[mime] ?? '.bin'}`;
  const full = safeStoragePath(privateRoot(), relative);
  await fs.mkdir(path.dirname(full), { recursive: true, mode: 0o700 });
  await fs.writeFile(full, buf, { mode: 0o600 });
  return relative;
}

export async function readIdentityFile(relative: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(safeStoragePath(privateRoot(), relative));
  } catch {
    return null;
  }
}

export async function removeIdentityFile(relative: string): Promise<void> {
  await fs.rm(safeStoragePath(privateRoot(), relative), { force: true });
}
