// Gorunen marka adi dagitim ortamindan gelir (NEXT_PUBLIC_APP_NAME); kodda marka yazmaz.
// Senkron baglamlar (metadata, istemci bilesenleri) bunu kullanir; sunucuda ayar tabanli ad icin getBrand().
// Ad yoksa notr kalir: baslik eki eklenmez, kelime isareti cizilmez.
export const APP_NAME = (process.env.NEXT_PUBLIC_APP_NAME ?? "").trim();

/** "Başlık | Marka" — marka yoksa yalniz baslik. */
export const withBrand = (text: string, sep = " | ") => (APP_NAME ? `${text}${sep}${APP_NAME}` : text);

/** Iki tonlu kelime isareti icin adi son buyuk harfli parcadan boler: "PaketJet" → ["Paket", "Jet"]. */
export function splitWordmark(name = APP_NAME): [string, string] {
  const m = name.match(/^(.+?)(\p{Lu}[^\p{Lu}\s]*)$/u);
  return m ? [m[1]!, m[2]!] : [name, ""];
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Basliktaki "| Marka" ekini veya "Marka |" onekini temizler. */
export function stripBrand(title: string, name = APP_NAME) {
  if (!name) return title;
  const n = escapeRe(name);
  return title.replace(new RegExp(`\\s*[|—-]\\s*${n}\\s*$`, "i"), "").replace(new RegExp(`^${n}\\s*\\|\\s*`, "i"), "");
}
