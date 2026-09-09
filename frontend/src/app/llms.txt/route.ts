import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";

export async function GET() {
  const content = `# PaketJet - P2P Kargo Pazaryeri

PaketJet, Türkiye'nin P2P (kişiden kişiye) kargo pazaryeridir. Taşıyıcılar ücretsiz güzergâh ilanı açar; göndericiler taşıyıcının iletişim bilgilerine erişmek için ilan alma hakkı kullanır. Kartla ödeme yalnız etkin sağlayıcı varsa sunulur. İletişim erişim ücreti taşıma bedeli değildir. Taşıma koşulları taraflarca doğrudan görüşülür.

## Temel Özellikler
- Şehir ve tarihle güzergâh arama
- Ücretsiz taşıyıcı ilanı ve moderasyon
- Maskeli iletişim ve ilan alma hakkı modeli
- Taşıyıcıyla doğrudan görüşme

## SEO & GEO Bilgileri
- Web: ${SITE_URL}
- Lokasyon: Türkiye Geneli
- Model: P2P Lojistik / Paylaşımlı Ekonomi

## Önemli Bağlantılar
- İlanlar: ${SITE_URL}/ilanlar
- Destek: ${SITE_URL}/destek
- Hakkımızda: ${SITE_URL}/hakkimizda
- Kullanım Koşulları: ${SITE_URL}/kullanim-kosullari
- Gizlilik: ${SITE_URL}/gizlilik-politikasi
- KVKK: ${SITE_URL}/kvkk
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
