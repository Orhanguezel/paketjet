# PaketJet Admin Panel Planı

Tarih: 2026-03-20

## 1. Mevcut Durum Özeti

PaketJet workspace içinde `backend`, `frontend` ve `admin_panel` mevcut. Ancak `admin_panel` klasörü önemli ölçüde generic bir panel şablonundan türetilmiş ve proje dışı modüller taşımaya devam ediyor.

İnceleme sonucu:

- PaketJet'e özel admin ekranları mevcut: `dashboard`, `ilanlar`, `bookings`, `users`, `wallet`, `contacts`.
- Backend tarafında PaketJet için çalışan admin route'ları mevcut: `users`, `ilanlar`, `bookings`, `wallet`, `dashboard`, `contacts`, `site-settings`, `storage`, `theme`, `gallery`, `categories`, `email_templates`.
- `audit` ve `telegram` için admin route dosyaları var ama `backend/src/app.ts` içinde register edilmiyor.
- `admin_panel` içinde proje dışı çok sayıda sayfa mevcut: `products`, `projects`, `pricing`, `flash-sale`, `resume`, `skills`, `brands`, `news-*`, `offer`, `resources` vb.
- `admin_panel/package.json` hâlâ `konig-admin`.
- `admin_panel/README.md` ve `admin_panel/frontend_admin_panel.md` PaketJet ile uyumsuz.
- Root `README.md` güncel değil; projede kaynak kod yokmuş gibi yazılmış.

## 2. Derleme Durumu

`admin_panel` içinde `npm run build` çalıştırıldı ve derleme başarısız oldu.

Mevcut build blokajları:

- `src/app/(main)/admin/(admin)/audit copy/AuditGeoMap.tsx`
  - `react-simple-maps` bulunamıyor
- `src/app/(main)/admin/(admin)/audit copy/admin-audit-client.tsx`
  - `@/components/admin/audit/AuditDailyChart` bulunamıyor
- `src/app/(main)/admin/(admin)/audit/admin-audit-client.tsx`
  - `@/components/admin/audit/AuditDailyChart` bulunamıyor
- `src/app/(main)/admin/(admin)/categories/_components/category-detail-client.tsx`
  - `@/app/(main)/admin/_components/common/useAIContentAssist` bulunamıyor
- `src/app/(main)/admin/(admin)/custompage/_components/custom-page-form.tsx`
  - `@/app/(main)/admin/_components/common/useAIContentAssist` bulunamıyor

Bu hatalar doğrudan PaketJet çekirdek admin modüllerinden değil, taşınmış generic modüllerden geliyor. İlk iş panelin build'ini kıran bu sayfaları temizlemek veya izole etmek gerekiyor.

## 3. Modül Envanteri

### 3.1 Backend'de admin desteği olan modüller

- `auth` -> kullanıcı yönetimi
- `dashboard`
- `ilanlar`
- `bookings`
- `wallet`
- `contact`
- `categories`
- `gallery`
- `storage`
- `siteSettings`
- `theme`
- `emailTemplates`
- `audit` -> route dosyası var, app'e register edilmemiş
- `telegram` -> route dosyası var, app'e register edilmemiş

### 3.2 Admin panelde tutulacak modüller

- `dashboard`
- `ilanlar`
- `bookings`
- `users`
- `carriers`
- `wallet`
- `contacts`
- `site-settings`
- `storage`
- `theme`
- `email-templates`
- `telegram`
- `audit`
- `categories`
- `gallery`
- `reports`

Kural:

- Bu listenin dışındaki admin modüller projede tutulmayacak.
- Sadece nav'dan gizlemek yeterli değil.
- Sayfa, component, endpoint, translation ve dokümantasyon kalıntıları da temizlenecek.

### 3.3 Tamamen temizlenecek modüller ve kalıntılar

- `products`
- `projects`
- `pricing`
- `flash-sale`
- `brands`
- `skills`
- `resume`
- `references`
- `resources`
- `offer`
- `newsletter`
- `popups`
- `menuitem`
- `footer-sections`
- `services`
- `faqs`
- `subcategories`
- `units`
- `variants`
- `subscriptions`
- `announcements`
- `articles`
- `library`
- `chat`
- `news-sources`
- `news-suggestions`
- `comments`
- `db`
- `integrations`
- `profile`
- `user-roles`
- `audit copy`

Temizlik kapsamı:

- route klasörleri
- ilgili `_components`
- kullanılmayan RTK endpoint dosyaları
- navigation kayıtları
- translation anahtarları
- README ve taslak dokümanlar
- marka ve proje adı kalıntıları

## 4. Tespit Edilen Kritik Uyumsuzluklar

### A. Route kayıt tutarsızlığı

- `backend/src/app.ts` içinde `registerAuditAdmin` ve `registerTelegramAdmin` çağrılmıyor.
- Sonuç: panelde bu sayfalar olsa bile API çalışmaz.

### B. Rol sözlüğü PaketJet ile uyumsuz

Mevcut admin panel kullanıcı katmanı şu rolleri varsayıyor:

- `admin`
- `moderator`
- `seller`
- `user`

PaketJet iş modelinde beklenen sözlük:

- `admin`
- `carrier`
- `customer`

Not:

- Backend `auth/admin.controller.ts` de şu an generic rol setini kullanıyor.
- Bu alan hem backend hem admin panel tarafında birlikte normalize edilmeli.

### C. Dashboard veri kontratı uyumsuz

- Frontend dashboard `items[]` biçiminde normalize edilmiş özet veri bekliyor.
- Backend `/admin/dashboard/summary` doğrudan özel alanlar döndürüyor:
  - `users`
  - `active_ilanlar`
  - `total_bookings`
  - `total_earnings`
  - `booking_stats`

Bu veri ya backend'de standart admin summary formatına çevrilmeli ya da frontend PaketJet özel dashboard DTO'su kullanmalı.

### D. Guard politikaları tutarsız

Bazı admin route'larda `preHandler: [requireAuth, requireAdmin]` var, bazılarında sadece `config: { auth: true }` kullanılıyor.

Özellikle gözden geçirilecek modüller:

- `bookings`
- `contacts`
- `siteSettings`
- `wallet`

Admin panel için tüm `/admin/*` route'larının açık ve tek tip bir admin guard kontratına çekilmesi gerekiyor.

### E. Marka ve dokümantasyon kalıntıları

- `konig-admin`
- `König Energetik`
- `Ensotek`
- `Bereket Fide`
- `Dijital Market`

Bu kalıntılar hem teknik borç hem yanlış yönlendirme yaratıyor.

## 5. PaketJet İçin Önerilen Admin MVP Kapsamı

İlk versiyonda teslim edilmesi gereken ekranlar:

1. `Dashboard`
2. `İlan Yönetimi`
3. `Rezervasyon Yönetimi`
4. `Kullanıcı Yönetimi`
5. `Taşıyıcılar`
6. `Cüzdan Yönetimi`
7. `İletişim Mesajları`
8. `Site Ayarları`
9. `Depolama`
10. `Tema`
11. `Email Template Yönetimi`

Bu ekranlar admin panelde kalan tek birinci sınıf modüller olacak.

İkinci faz ekranlar:

1. `Telegram`
2. `Audit`
3. `Categories`
4. `Gallery`
5. `Raporlar`

İkinci faz dışındaki tüm admin modülleri kaldırılacak.

## 6. Uygulama Fazları

## Faz 0: Stabilizasyon ve Temizlik

Amaç: Admin panelin derlenebilir, anlaşılır ve PaketJet odaklı hale gelmesi.

Yapılacaklar:

- `admin_panel` içindeki liste dışı tüm sayfaları fiziksel olarak kaldır
- build kıran generic sayfaları geçici olarak saklamak yerine projeden sök
- nav, permissions ve dashboard modül kartlarını sadece kalacak ekranlara indir
- kullanılmayan endpoint, type ve i18n anahtarlarını temizle
- `admin_panel/package.json` adını PaketJet'e uygun hale getir
- `admin_panel/README.md` ve ilgili dokümanları güncelle
- root `README.md` içindeki yanlış workspace açıklamasını düzelt

Çıkış kriteri:

- `admin_panel` build alıyor olmalı
- sidebar yalnızca onaylanan PaketJet modüllerini göstermeli
- listede olmayan modüllerden dosya bazında kalıntı kalmamalı

## Faz 1: Çekirdek Backend-Frontend Kontrat Düzeltmeleri

Amaç: Kritik modüllerin API sözleşmesini sabitlemek.

Yapılacaklar:

- `audit` ve `telegram` admin route'larını `backend/src/app.ts` içine register et
- tüm admin route guard'larını tek tipe çek
- `users` modülündeki rol modelini PaketJet sözlüğüne göre düzenle
- `dashboard` özet response'unu frontend ile uyumlu hale getir
- kullanıcı/tasıyıcı/müşteri ayrımını açık şekilde tanımla
- `carriers` ekranı için backend ve frontend kontratını sabitle

Çıkış kriteri:

- dashboard, users, ilanlar, bookings, wallet ekranları tutarlı veri alıyor olmalı

## Faz 2: Çekirdek Admin Modüllerin Tamamlanması

Amaç: Operasyon ekibinin kullanacağı ana panelin bitirilmesi.

Yapılacaklar:

- dashboard ekranını PaketJet KPI'ları ile yenile
- `ilanlar` ekranına detay, filtre ve hızlı aksiyonlar ekle
- `bookings` ekranına durum akışı ve detay drawer/modal ekle
- `users` ekranını `admin/carrier/customer` modeline geçir
- `carriers` ekranını backend `/admin/carriers` ile bağla
- `wallet` ekranında işlem geçmişi ve manuel düzeltme akışını doğrula
- `contacts` ekranını operasyonel kullanım için sadeleştir

Çıkış kriteri:

- admin ekibi taşıma operasyonunu panelden yönetebilmeli

## Faz 3: Sistem Modülleri

Amaç: İçerik ve sistem yönetimi ekranlarını sabitlemek.

Yapılacaklar:

- `site-settings`
- `storage`
- `theme`
- `email-templates`
- `categories`
- `gallery`

Çıkış kriteri:

- içerik, medya ve sistem ayarları panelden yönetilebilmeli

## Faz 4: Operasyon ve İzleme

Amaç: İleri seviye yönetim araçlarını açmak.

Yapılacaklar:

- `telegram`
- `audit`
- `reports`

Çıkış kriteri:

- admin panel operasyon gözlemi ve uyarı süreçlerini desteklemeli

## 7. Önerilen İlk Sprint

İlk sprintte şu sıra izlenmeli:

1. Liste dışı modülleri dosya bazında kaldır
2. Sidebar ve dashboard'ı sadece kalacak PaketJet modüllerine indir
3. `audit` ve `telegram` route registration eksiklerini gider
4. `users` rol sözlüğünü PaketJet modeline çek
5. `carriers` ekranını gerçek backend route'u ile ekle
6. dashboard summary kontratını netleştir

## 8. Bu İnceleme Sonrası Net Karar

Admin paneli sıfırdan yazmak gerekmiyor. Daha doğru yaklaşım:

- mevcut PaketJet'e özel parçaları korumak
- liste dışı generic şablon kalıntılarını tamamen sökmek
- backend kontratlarını PaketJet iş modeline göre sadeleştirmek

Bu yaklaşım hem daha hızlı hem de mevcut yatırımı koruyan yol.

## 9. Bir Sonraki Uygulama Adımı

Bir sonraki teknik adım olarak şunu öneriyorum:

`Faz 0 + Faz 1` birlikte ele alınsın.

Somut başlangıç paketi:

- admin nav temizliği
- liste dışı modüllerin silinmesi
- build blocker kaldırma
- `app.ts` admin registration düzeltmeleri
- `users` rol modeli düzeltmesi
- `carriers` sayfasının eklenmesi

Bu paket tamamlandıktan sonra admin panel artık güvenle genişletilebilir hale gelir.
