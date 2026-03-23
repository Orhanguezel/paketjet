// src/modules/ratings/helpers/controller.ts
export function parseCarrierRatingsPaging(query: Record<string, string>) {
  return {
    limit: Math.min(50, Math.max(1, parseInt(query.limit ?? "10", 10))),
    offset: Math.max(0, parseInt(query.offset ?? "0", 10)),
  };
}
