// src/modules/_shared/secret-box.ts
// Veritabaninda saklanan gizli ayarlar icin AES-256-GCM. Anahtar: SETTINGS_ENCRYPTION_KEY (64 hex).
// Cikti "v1:<iv>:<tag>:<ciphertext>" (base64url). Anahtar yanlis/eksikse acilmaz, sessiz varsayilan yok.
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

function keyFrom(hex: string) {
  const key = Buffer.from(hex, 'hex');
  if (key.length !== 32) throw new Error('SETTINGS_ENCRYPTION_KEY must be 64 hex characters');
  return key;
}

export function sealSecret(plain: string, keyHex: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', keyFrom(keyHex), iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return ['v1', iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), data.toString('base64url')].join(':');
}

export function openSecret(sealed: string, keyHex: string): string {
  const [v, iv, tag, data] = sealed.split(':');
  if (v !== 'v1' || !iv || !tag || !data) throw new Error('secret_format_invalid');
  const decipher = createDecipheriv('aes-256-gcm', keyFrom(keyHex), Buffer.from(iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]).toString('utf8');
}
