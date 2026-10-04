// Güzergâh rehberinde o rotadaki yayındaki ilanlar. Veri: herkese açık ilan araması.
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { getPublicJson } from "@/lib/public-fetch";

type Row = { id: string; slug?: string; from_city: string; to_city: string; departure_date?: string; vehicle_type?: string };
const VEHICLE: Record<string, string> = { car: "Otomobil", van: "Kamyonet", truck: "Kamyon", motorcycle: "Motosiklet", other: "Diğer" };

export default async function RouteLiveListings({ from, to }: { from: string; to: string }) {
  const res = await getPublicJson<Row[] | { data?: Row[] }>(`/api/ilanlar?from_city=${encodeURIComponent(from)}&to_city=${encodeURIComponent(to)}&limit=10`, 600);
  const rows = (Array.isArray(res) ? res : res?.data ?? []).slice(0, 5);
  const search = `${ROUTES.ilanlar.list}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  return (
    <section id="guncel-ilanlar">
      <h2>{from} – {to} yayındaki ilanlar</h2>
      {rows.length ? (
        <ul>
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={ROUTES.ilanlar.detail(r.slug || r.id)}>{r.from_city} → {r.to_city}</Link>
              {r.departure_date ? ` · ${new Date(r.departure_date).toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul" })}` : ""}
              {r.vehicle_type ? ` · ${VEHICLE[r.vehicle_type] ?? r.vehicle_type}` : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p>Bu rotada şu anda yayında ilan bulunmuyor. Farklı tarih veya araç filtreleriyle arama yapabilir, taşıyıcıysan güzergâhını ücretsiz paylaşabilirsin.</p>
      )}
      <p><Link href={search}>Tüm {from} – {to} ilanlarını ara</Link> · <Link href={ROUTES.ilanVer}>Ücretsiz ilan ver</Link></p>
    </section>
  );
}
