import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paketjet.com";

export async function GET() {
  const content = `# PaketJet - P2P Kargo Pazaryeri

PaketJet, Türkiye'nin P2P (kişiden kişiye) kargo pazaryeridir. Göndericiler ücretsiz ilan açar; taşıyıcılar ilan sahibinin iletişim bilgilerine erişmek için ilan alma hakkı kullanır.

## Temel Özellikler
- 81 ilde aktif kargo ağı
- Güvenli P2P lojistik modeli
- Maskeli iletişim ve ilan alma hakkı modeli
- Şehirler arası gönderi-talep eşleşmesi

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
