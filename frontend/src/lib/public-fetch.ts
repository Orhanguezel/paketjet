// Sunucu bilesenlerinde herkese acik API verisi: 5 dk ISR onbellegi, hata/zaman asimi null doner.
// Layout'ta kullanildigi icin no-store KULLANILMAZ; aksi halde tum sayfalar dinamiklesir.
const base = () => (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8078").replace(/\/$/, "");

export async function getPublicJson<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const response = await fetch(`${base()}${path}`, { next: { revalidate }, signal: AbortSignal.timeout(5000) });
    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
}
