// Yayımlanmış yasal sayfalar: sabit yayımlananlar + yönetici panelinden yayımlanınca API'de görünenler.
// Menü ve site haritası bu listeyi kullanır; böylece yeni metin yayımlanınca kod değişmeden görünür.
import { API } from "@/config/api-endpoints";
import { getPublicJson } from "@/lib/public-fetch";
import { legalPages } from "./legal-content";

export async function getPublishedLegalSlugs(): Promise<string[]> {
  const pending = await Promise.all(
    legalPages.filter((p) => !p.published).map(async (p): Promise<string | null> => ((await getPublicJson(`${API.customPages.bySlug(p.slug)}?locale=tr`)) ? p.slug : null)),
  );
  return [...legalPages.filter((p) => p.published).map((p) => p.slug), ...pending.filter((s): s is string => !!s)];
}
