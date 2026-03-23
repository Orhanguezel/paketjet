// src/modules/ratings/helpers/repository.ts
export function toCarrierRatingStats(row?: { avg_score?: unknown; total?: unknown } | null) {
  return {
    avg: parseFloat(String(row?.avg_score ?? "0")) || 0,
    count: Number(row?.total ?? 0),
  };
}
