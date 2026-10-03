'use client';

import { useEffect, useState } from 'react';
import { IdCard } from 'lucide-react';
import { fetchIdentityFrontUrl } from '@/integrations/endpoints/admin/identity-admin-endpoints';

/** Görsel yalnız açıkça istendiğinde yüklenir; her görüntüleme backend'de loglanır. */
export default function IdentityImage({ userId }: { userId: string }) {
  const [show, setShow] = useState(false);
  const [url, setUrl] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!show) return;
    let alive = true;
    let local = '';
    setFailed(false);
    fetchIdentityFrontUrl(userId)
      .then((next) => {
        local = next;
        if (alive) setUrl(next);
        else URL.revokeObjectURL(next);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
      if (local) URL.revokeObjectURL(local);
    };
  }, [show, userId]);

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        className="flex aspect-[85.6/54] w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground hover:bg-muted/40"
      >
        <IdCard className="size-8" />
        Görseli göster
      </button>
    );
  }
  if (failed) return <p className="text-sm text-destructive">Görsel yüklenemedi.</p>;
  if (!url) return <div className="aspect-[85.6/54] w-full max-w-xs animate-pulse rounded-lg bg-muted" />;
  return (
    <a href={url} target="_blank" rel="noopener" className="block w-full max-w-xs">
      {/* biome-ignore lint/performance/noImgElement: yerel blob URL, next/image gerekmez */}
      <img src={url} alt="Kimlik ön yüzü" className="aspect-[85.6/54] w-full rounded-lg border object-cover" />
    </a>
  );
}
