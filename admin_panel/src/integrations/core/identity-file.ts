// src/integrations/core/identity-file.ts
import { BASE_URL } from '@/integrations/api-base';
import { tokenStore } from '@/integrations/core/token';
import { IDENTITY_ADMIN_BASE, type IdentitySide } from '@/integrations/shared/identity';

/** Kimlik gorseli yetkili endpoint'ten blob olarak alinir; URL kullanimdan sonra revoke edilmelidir. */
export async function fetchIdentitySideUrl(userId: string, side: IdentitySide): Promise<string> {
  const token = tokenStore.get();
  const res = await fetch(`${BASE_URL.replace(/\/$/, '')}${IDENTITY_ADMIN_BASE}/${encodeURIComponent(userId)}/${side}`, {
    credentials: 'include',
    cache: 'no-store',
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('identity_image_failed');
  return URL.createObjectURL(await res.blob());
}
