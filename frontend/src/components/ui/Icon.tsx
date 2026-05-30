"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getStorageAssetByName } from "@/modules/storage/storage.service";

const FALLBACK_NAMES: Record<string, string> = {
  dashboard: "ilanlarim",
  "ilan-ver": "ilanlarim",
  "iletisimi-gor": "satin-aldiklarim",
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  alt?: string;
  folder?: "icons" | "logo";
}

export default function Icon({ name, size = 28, className, alt = "", folder = "icons" }: IconProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getStorageAssetByName(folder, name)
      .then((asset) => {
        if (alive) setSrc(asset.url);
      })
      .catch(async () => {
        const fallback = FALLBACK_NAMES[name];
        if (!fallback || fallback === name) {
          if (alive) setSrc(null);
          return;
        }
        try {
          const asset = await getStorageAssetByName(folder, fallback);
          if (alive) setSrc(asset.url);
        } catch {
          if (alive) setSrc(null);
        }
      });
    return () => {
      alive = false;
    };
  }, [folder, name]);

  if (!src) {
    return (
      <span
        aria-hidden="true"
        className={cn("inline-block rounded-full bg-blue-soft", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("inline-block shrink-0 object-contain", className)}
      loading="lazy"
      decoding="async"
    />
  );
}
