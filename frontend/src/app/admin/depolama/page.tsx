"use client";
import { useState, useEffect, useCallback } from "react";
import { adminListAssets, adminDeleteAsset, type StorageAsset } from "@/modules/admin/admin.service";
import { AdminPageHeader, AdminPagination, AdminEmptyState, AdminListSkeleton } from "@/components/admin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

const LIMIT = 20;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mimeColor(mime: string): "brand" | "success" | "warning" | "muted" {
  if (mime.startsWith("image/")) return "brand";
  if (mime.startsWith("application/pdf")) return "danger" as "brand";
  if (mime.startsWith("video/")) return "warning";
  return "muted";
}

export default function AdminStoragePage() {
  const [assets, setAssets] = useState<StorageAsset[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try { setAssets(await adminListAssets({ page: p, limit: LIMIT })); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  async function handleDelete(id: string) {
    if (!confirm("Bu dosyayi silmek istiyor musunuz?")) return;
    setActionId(id);
    try { await adminDeleteAsset(id); await load(page); }
    catch (e) { console.error(e); } finally { setActionId(null); }
  }

  const totalPages = Math.ceil(assets.length / LIMIT);

  return (
    <div>
      <AdminPageHeader title="Depolama" subtitle={`${assets.length} dosya`} />

      {loading ? <AdminListSkeleton /> : assets.length === 0 ? <AdminEmptyState message="Yuklenmis dosya yok." /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {assets.map((a) => (
            <div key={a.id} className="bg-surface rounded-xl border border-border-soft p-4">
              {a.mimetype.startsWith("image/") && (
                <div className="mb-3 rounded-lg overflow-hidden bg-bg-alt h-32 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.url} alt={a.filename} className="max-h-full max-w-full object-contain" />
                </div>
              )}
              <p className="font-semibold text-sm text-foreground truncate mb-1">{a.filename}</p>
              <div className="flex items-center gap-2 mb-2">
                <Badge color={mimeColor(a.mimetype)}>{a.mimetype.split("/")[1]}</Badge>
                <span className="text-xs text-muted">{formatSize(a.size)}</span>
                <span className="text-xs text-faint">{formatDate(a.created_at)}</span>
              </div>
              <div className="flex gap-2">
                <a href={a.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-brand hover:underline">Ac</a>
                <Button size="sm" variant="danger" loading={actionId === a.id} onClick={() => handleDelete(a.id)}>
                  Sil
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
