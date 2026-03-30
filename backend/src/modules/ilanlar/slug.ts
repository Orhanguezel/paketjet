// src/modules/ilanlar/slug.ts
// İlan slug üretici: "istanbul-ankara-minivan-3nis" gibi anlamlı URL

const TR_MAP: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
  Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
};

function turkishToAscii(str: string): string {
  return str.replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => TR_MAP[c] ?? c);
}

function slugify(str: string): string {
  return turkishToAscii(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const MONTHS_TR = ["oca", "sub", "mar", "nis", "may", "haz", "tem", "agu", "eyl", "eki", "kas", "ara"];

/**
 * İlan verilerinden slug üretir:
 * "istanbul-ankara-minivan-3nis" veya "izmir-istanbul-kamyon-15may"
 */
export function generateIlanSlug(data: {
  from_city: string;
  to_city: string;
  vehicle_type?: string;
  departure_date: Date | string;
}): string {
  const from = slugify(data.from_city);
  const to = slugify(data.to_city);
  const vehicle = data.vehicle_type ? slugify(data.vehicle_type) : "";

  const date = new Date(data.departure_date);
  const day = date.getDate();
  const month = MONTHS_TR[date.getMonth()] ?? "";
  const datePart = `${day}${month}`;

  const parts = [from, to, vehicle, datePart].filter(Boolean);
  const base = parts.join("-");

  // Benzersizlik için kısa random suffix
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}
