# PaketJet

PaketJet, taşıyıcıların güzergâh ilanı verdiği ve göndericilerin uygun ilanın özel iletişim bilgilerine erişim satın aldığı pazaryeridir. Taşıma ücreti taraflar arasında belirlenir; platform kargo takibi, escrow, payout veya taşıma garantisi sunmaz.

| Uygulama | Kaynak | Yerel port | Canlı port |
| --- | --- | --- | --- |
| API | `backend/` — Fastify 5, Drizzle, MySQL 8 | 8078 | 8070 |
| Web | `frontend/` — Next.js 15, React 19, Tailwind 4 | 3000 | 3070 |
| Yönetim | `admin_panel/` — Next.js 15, RTK Query, Shadcn | 3030 | 3071 |

Canlı web `https://paketjet.com`, yönetim `https://panel.paketjet.com`. SSH hedefi `vps-paketjet`, aktif sürüm `/var/www/paketjet-current`, sürüm dizinleri `/var/www/paketjet-releases/<commit>`, eski kaynak/upload arşivi `/var/www/paketjet`; süreçler PM2 ile yönetilir. Docker dosyalarının bulunması üretimin Docker üzerinde çalıştığı anlamına gelmez.

## Geliştirme ve doğrulama

Bun 1.3.10 ve Node 22/24 kullanılır. Her uygulamanın kendi dizininde `bun install --frozen-lockfile`, ardından `bun run dev`. Ortam değişkenleri ilgili env örneğine göre yerel ve Git dışında tutulur. Backend için MySQL gerekir. İki arayüzün `API_INTERNAL_URL` değeri aynı backend'i göstermelidir. Tarayıcı API çağrıları aynı origin `/api` üzerinden geçer.

- Backend: `bun test src/test/`, `bun run build`.
- Web: `bun run test`, `bun run lint`, `bun run build`.
- Admin: `bun run test`, `bun run lint` (Biome), `bun run build` (tip kontrolünü içerir).
- Test DB adı `paketjet_test_` ile başlamalı; production hedefi reddedilir. `backend/.env.test.local` yalnız izole yerel test içindir.
- Temiz test kurulumu: test DB ve rastgele başlangıç parolaları ile `bun run db:seed`. **Üretimde seed çalıştırılmaz.**
- Mevcut DB yükseltmesi: `bun scripts/renewal-migrate.ts` önce plan üretir. `--apply` uygular, üretim ayrıca `--production` ister; dosya checksum günlüğü tekrar uygulamayı engeller.

Kod düzeni ve sınırlar [AGENTS.md](AGENTS.md) içindedir. `project.portfolio.json` envanter metadata'sıdır; çalışan ürün ve yayın durumu için aşağıdaki doğrulanmış belgeler esas alınır.

## Yenileme ve işletim

- [Ana çeklist](CEKLIST-IYILESTIRME-VE-TASARIM.md)
- [Durum raporu](DURUM-RAPORU-2026-09-09.md)
- [Yürütme ve test kaydı](YURUTME-KAYDI-2026-09-09.md)
- [Tasarım yönergesi](TASARIM-YONERGESI-2026-09-09.md)
- [Yedek, migration, yayın ve geri dönüş](ISLETIM-VE-YAYIN-2026-09-09.md)

Etkin kart sağlayıcısı doğrulanmış gerçek anahtarlarla açılana kadar `PAYMENT_PROVIDER=disabled` kullanılır. Eski TL cüzdanları arşivdir; kendiliğinden satın alma hakkına veya gelire dönüştürülmez. Eski ödeme callback'leri mutabakat için korunur.

- [Tasarım ikinci tur: renk, hareket ve canlı doğrulama](output/design-v2/DESIGN.md)
