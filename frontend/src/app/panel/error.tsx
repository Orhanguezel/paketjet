"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function PanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-border-soft bg-surface p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand mb-3">Panel</p>
        <h1 className="text-2xl font-extrabold text-foreground mb-3">
          Panel yüklenirken bir sorun oluştu
        </h1>
        <p className="text-sm text-muted mb-6">
          Veriler geçici olarak alınamadı veya beklenmeyen bir hata oluştu.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-bg-alt transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
        {process.env.NODE_ENV !== "production" && (
          <pre className="mt-6 rounded-2xl bg-bg-alt p-4 text-left text-xs text-muted overflow-x-auto">
            {error.message}
          </pre>
        )}
      </div>
    </div>
  );
}
