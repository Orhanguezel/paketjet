'use client';

import { useMemo } from 'react';
import {
  useGetSiteSettingByKeyQuery,
} from '@/integrations/hooks';
import { normalizeSiteSettingsBrandingConfig } from '@/integrations/shared';

type AuthBrandPanelProps = {
  title: string;
  subtitle: string;
};

export function AuthBrandPanel({ title, subtitle }: AuthBrandPanelProps) {
  const { data: configData } = useGetSiteSettingByKeyQuery('ui_admin_config');
  const { data: brandImageData } = useGetSiteSettingByKeyQuery('login_brand_image');

  const branding = useMemo(
    () => (configData ? normalizeSiteSettingsBrandingConfig(configData) : null),
    [configData],
  );

  // login_brand_image key'inden dinamik görsel (admin panelden değiştirilebilir)
  const brandImage = useMemo(() => {
    if (!brandImageData) return null;
    // API response: { key, value, ... } veya doğrudan string
    const raw = typeof brandImageData === 'object' && 'value' in brandImageData
      ? (brandImageData as { value?: string }).value
      : typeof brandImageData === 'string' ? brandImageData : null;
    if (!raw) return null;
    // value düz string olabilir ("/uploads/...") veya JSON string olabilir
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'string') return parsed;
      if (parsed && typeof parsed === 'object' && parsed.url) return parsed.url as string;
    } catch {
      // JSON değilse düz string olarak kullan
    }
    return raw;
  }, [brandImageData]);

  const logoAlt = branding?.app_name || 'PaketJet';

  // /uploads/ ile başlayan relative path'leri backend origin'ine çevir
  const mediaOrigin = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api$/, '');
  const imageSrc = brandImage
    ? brandImage.startsWith('/') ? `${mediaOrigin}${brandImage}` : brandImage
    : null;

  return (
    <div className="relative hidden flex-col overflow-hidden lg:flex lg:w-1/3">
      {/* Arka plan görseli / gif / video */}
      <div className="absolute inset-0 bg-primary" />

      {/* Ortala: görsel + yazı */}
      <div className="relative flex h-full flex-col items-center justify-center gap-6">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={logoAlt}
            className="w-full object-cover"
          />
        ) : null}
        <div className="space-y-2 px-8 text-center">
          <h1 className="font-light text-4xl text-white">{title}</h1>
          <p className="text-lg text-white/80">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
