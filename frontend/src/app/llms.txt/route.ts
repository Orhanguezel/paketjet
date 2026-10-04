// /llms.txt — AI sistemleri için site özeti (llmstxt.org biçimi): blok alıntı özet, temel bilgiler,
// açıklamalı bağlantılar. Rehber listesi içerik verisinden, marka/iletişim/fiyat admin ayarlarından gelir.
import { getBrand } from "@/lib/brand";
import { getPublicJson } from "@/lib/public-fetch";
import { SITE_URL } from "@/lib/seo";
import { ALL_GUIDES } from "@/modules/content/content.data";
import { PRODUCT_FAQS, PRODUCT_SUMMARY } from "@/modules/content/product-facts";

export const revalidate = 3600;

export async function GET() {
  const [b, packs, single] = await Promise.all([
    getBrand(),
    getPublicJson<{ data?: { credits: number; price: number }[] }>("/api/ilan-alma-hakki/paketler", 3600),
    getPublicJson<{ value?: number }>("/api/site_settings/pricing.listing_credit_price?locale=tr", 3600),
  ]);
  const prices = [single?.value ? `tek ilan ${single.value} TL` : "", ...(packs?.data ?? []).map((p) => `${p.credits} hak ${p.price} TL`)].filter(Boolean).join(", ");
  const link = (title: string, path: string, desc: string) => `- [${title}](${SITE_URL}${path}): ${desc}`;
  const lines = [
    `# ${b.name}`,
    "",
    `> ${PRODUCT_SUMMARY}`,
    "",
    "## Temel bilgiler",
    "- Hizmet türü: taşıyıcı güzergâh ilanları ve iletişim erişimi (P2P kargo pazaryeri), Türkiye geneli.",
    "- Taşıyıcılar için ilan vermek ücretsizdir; yeni ve düzenlenen ilanlar yayına girmeden önce incelenir.",
    `- Ücret yalnız bir ilanın iletişim bilgilerine erişim içindir ve taşıma bedelini kapsamaz${prices ? ` (güncel: ${prices})` : ""}.`,
    "- Platform taşıma yapmaz; rezervasyon, paket takibi, emanet ödeme veya teslim garantisi sunmaz.",
    "- Kartla ödemeler güvenli ödeme sayfasında 3D Secure ile alınır; kart bilgileri siteye iletilmez.",
    "- Firmalar ilanlarını Partner API ile kendi sistemlerinden otomatik oluşturabilir.",
    "",
    "## Sorular ve yanıtlar",
    "",
    ...PRODUCT_FAQS.flatMap((f) => [`### ${f.question}`, f.answer, ""]),
    "## Rehberler",
    ...ALL_GUIDES.map((g) => link(g.title, g.canonicalPath, g.description)),
    "",
    "## Platform",
    link("Taşıyıcı ilanları", "/ilanlar", "Yayındaki ilanları güzergâh, tarih ve araç tipine göre arama sayfası."),
    link("Ücretsiz ilan ver", "/ilan-ver", "Taşıyıcıların güzergâh ve boş kapasite ilanı oluşturduğu adımlı form."),
    link("Destek ve SSS", "/destek", "İlan, iletişim erişimi, ödeme, iade ve hesap işlemleri hakkında sıkça sorulan sorular."),
    link("Geliştiriciler (Partner API)", "/gelistiriciler", "API anahtarıyla otomatik ilan oluşturma, güncelleme ve kapatma belgesi."),
    link("Hakkımızda", "/hakkimizda", "Platformun nasıl çalıştığı, ücret modeli ve ilkeleri."),
    "",
    "## Kurallar ve yasal",
    link("Taşıma kuralları", "/tasima-kurallari", "Yasaklı ve kısıtlı gönderiler, paketleme, değer beyanı ve teslim kanıtı."),
    link("Kullanım koşulları", "/kullanim-kosullari", "Kullanıcı sözleşmesi: platformun rolü, sorumluluklar ve uyuşmazlık hükümleri."),
    link("Gizlilik politikası", "/gizlilik-politikasi", "Kişisel verilerin işlenme, paylaşım ve saklama esasları."),
    link("KVKK aydınlatma metni", "/kvkk", "Kişisel verilerin işlenmesi ve veri sahibi hakları."),
    "",
    "## İletişim",
    link("İletişim", "/iletisim", "Destek ve iş birliği talepleri için iletişim formu ve kanallar."),
    ...(b.sameAs.length ? [`- Sosyal profiller: ${b.sameAs.join(", ")}`] : []),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
