import {PRODUCT_SUMMARY,PRODUCT_FAQS} from '@/modules/content/product-facts';
import {BLOG_POSTS,ROUTE_GUIDES} from '@/modules/content/content.data';
import {SITE_URL} from '@/lib/seo';
export function GET(){
 const content = `# PaketJet

${PRODUCT_SUMMARY}

## Sorular ve yanıtlar

${PRODUCT_FAQS.map(f=>`### ${f.question}\n${f.answer}`).join('\n\n')}

## Rehberler
${[...BLOG_POSTS,...ROUTE_GUIDES].map(p=>`- [${p.title}](${SITE_URL}${p.canonicalPath}): ${p.description}`).join('\n')}

## Platform
- [İlanlar](${SITE_URL}/ilanlar)
- [Destek](${SITE_URL}/destek)
- [Hakkımızda](${SITE_URL}/hakkimizda)
- [İletişim](${SITE_URL}/iletisim)
- [Taşıma kuralları](${SITE_URL}/tasima-kurallari)
- [Kullanım koşulları](${SITE_URL}/kullanim-kosullari)
- [Gizlilik politikası](${SITE_URL}/gizlilik-politikasi)
- [KVKK](${SITE_URL}/kvkk)

İlan durumu ve hareket tarihi zamanla değişir; güncel bilgi için ilan sayfası esas alınır. Başlığı ÖRNEK ile başlayan ilanlar örnek içeriktir. Kartla ödeme yalnız etkin bir ödeme sağlayıcısı bulunduğunda sunulur.
`;
 return new Response(content,{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=3600'}});
}
