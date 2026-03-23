# CP-22 — Cuzdan Yeniden Yapisi, Para Cekme, Kayit Onay Mekanizmasi

## Ozet

Mevcut cuzdan sayfasi sadece bakiye + deposit + islem listesinden olusuyor. Bu CP ile:

1. Tasiyici para cekme talebi olusturabilecek (wallet → banka hesabina)
2. Cuzdan sayfasi role-aware olacak (musteri vs tasiyici farkli gorunum)
3. Panel sidebar'da hem tasiyici hem musteri "Tasima Kurallari" gorecek
4. Uyelik formunda "Tasima Kurallari + Kullanim Kosullari" onay checkbox'u zorunlu olacak

**Orkestrasyon:** Mimari + kod = Claude Code, UI/UX dogrulama = Antigravity

---

## CP-22A — DB: withdrawal_requests tablosu

**Yeni tablo:** `withdrawal_requests`

```
id               CHAR(36) PK
user_id          CHAR(36) FK → users.id
bank_account_id  CHAR(36) FK → carrier_bank_accounts.id
amount           DECIMAL(14,2)
currency         VARCHAR(10) DEFAULT 'TRY'
status           ENUM('pending','processing','completed','rejected') DEFAULT 'pending'
admin_notes      TEXT NULL
requested_at     DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
processed_at     DATETIME(3) NULL
```

Dosyalar:
- [ ] `backend/src/modules/withdrawal/schema.ts` — Drizzle tablo tanimi
- [ ] `backend/src/db/seed/sql/027_withdrawal_requests_schema.sql` — CREATE TABLE IF NOT EXISTS

---

## CP-22B — Backend: withdrawal modulu

Tasiyici, bakiyesinden banka hesabina para cekme talebi olusturur. Minimum tutar yok.

Akis:
1. Tasiyici `POST /withdrawal` → bakiyeden duser, withdrawal_requests'e `pending` kayit
2. Admin `PUT /admin/withdrawals/:id/process` → `completed` veya `rejected` (rejected ise bakiye geri yazar)

Dosyalar:
- [ ] `withdrawal/schema.ts` — tablo + tipler
- [ ] `withdrawal/validation.ts` — amount > 0, zorunlu bank_account_id
- [ ] `withdrawal/repository.ts` — `repoCreateWithdrawal`, `repoListMyWithdrawals`, `repoGetWithdrawalById`, `repoListAllWithdrawals`, `repoProcessWithdrawal`
- [ ] `withdrawal/controller.ts` — `createWithdrawal` (POST), `listMyWithdrawals` (GET)
- [ ] `withdrawal/admin.controller.ts` — `adminListWithdrawals`, `adminProcessWithdrawal`
- [ ] `withdrawal/router.ts` — `/withdrawal`, `/withdrawal/my`
- [ ] `withdrawal/admin.routes.ts` — `/withdrawals`, `/withdrawals/:id/process`
- [ ] `withdrawal/index.ts` — barrel
- [ ] `routes.ts` — register (public + admin)

### createWithdrawal Mantigi

```
1. getAuthUserId → userId
2. Validate: amount > 0
3. repoGetBankByUserId(userId) → bank yoksa hata
4. getOrCreateWallet(userId) → balance < amount ise "insufficient_balance"
5. Transaction icinde:
   a. wallets.balance -= amount
   b. wallets.total_withdrawn += amount
   c. wallet_transactions INSERT (type: debit, purpose: withdrawal, status: completed)
   d. withdrawal_requests INSERT (status: pending)
6. Return withdrawal record
```

### adminProcessWithdrawal Mantigi

```
1. status = "completed" → sadece isaretle, bakiye zaten dustu
2. status = "rejected" → bakiyeyi geri yaz:
   a. wallets.balance += amount
   b. wallets.total_withdrawn -= amount
   c. wallet_transactions INSERT (type: credit, purpose: withdrawal_refund)
   d. withdrawal_requests SET status=rejected, admin_notes, processed_at
```

---

## CP-22C — Backend: auth rules_accepted alani

Kullanici kayit sirasinda kurallari kabul ettigini belirtecek.

- [ ] `auth/schema.ts` — `users` tablosuna `rules_accepted_at DATETIME(3) NULL` ekle
- [ ] `auth/controller.ts` — `signup` handler'da `rules_accepted: boolean` body param kontrolu. `true` ise `rules_accepted_at = NOW()`, degilse 400 hata
- [ ] `auth/validation.ts` — registerSchema'ya `rules_accepted: z.literal(true)` ekle
- [ ] Seed SQL: `ALTER TABLE users ADD COLUMN rules_accepted_at DATETIME(3) NULL` (028_)

NOT: Mevcut kullanicilar icin `rules_accepted_at` NULL kalir. Ilerleyen donemde zorunlu hale getirilebilir.

---

## CP-22D — Frontend: withdrawal modulu + API

- [ ] `modules/withdrawal/withdrawal.type.ts` — `WithdrawalRequest` interface
- [ ] `modules/withdrawal/withdrawal.service.ts` — `createWithdrawal`, `getMyWithdrawals`
- [ ] `config/api-endpoints.ts` — `withdrawal: { create, my }` + `admin.withdrawals`

---

## CP-22E — Frontend: Cuzdan sayfasi yeniden yapisi

Mevcut `/panel/cuzdan` 150 satir, tek bir page. Yeni yapi:

```
panel/cuzdan/
  page.tsx                    — ince shell: bakiye karti + tab sistemi
  _components/
    BakiyeCard.tsx            — bakiye + toplam kazanc + toplam cekim
    IslemlerTab.tsx            — tum wallet transactions (filtreli)
    ParaCekTab.tsx             — cekim formu + cekim gecmisi (sadece carrier)
    DepositTab.tsx             — Iyzico bakiye yukleme formu
```

**Tab yapisi:**
- Musteri: "Bakiye Yukle" | "Islemler"
- Tasiyici: "Bakiye Yukle" | "Islemler" | "Para Cek"

Detaylar:

### BakiyeCard
- Bakiye (buyuk rakam)
- Toplam kazanc (carrier icin)
- Toplam cekim (carrier icin)
- Bekleyen cekim talebi varsa uyari banner

### IslemlerTab
- Tum islemler listesi (mevcut ile ayni)
- Filtre: type (credit/debit), purpose (deposit/booking_payment/booking_earning/withdrawal/withdrawal_refund)
- Pagination

### ParaCekTab (sadece carrier)
- Banka hesabi bilgisi goruntuleme (yoksa "Finans tab'dan ekleyin" uyarisi)
- Cekim tutari inputu
- "Cek" butonu
- Bekleyen/tamamlanan/reddedilen cekim gecmisi listesi

### DepositTab
- Mevcut Iyzico deposit formu (extract)

Dosyalar:
- [ ] `panel/cuzdan/page.tsx` — shell + tab
- [ ] `panel/cuzdan/_components/BakiyeCard.tsx`
- [ ] `panel/cuzdan/_components/IslemlerTab.tsx`
- [ ] `panel/cuzdan/_components/ParaCekTab.tsx`
- [ ] `panel/cuzdan/_components/DepositTab.tsx`

---

## CP-22F — Frontend: Panel'de Tasima Kurallari linkleri

Her iki panel'de de gorunecek:

- [ ] `panel/layout.tsx` — NAV dizisine `{ href: "/tasima-kurallari", label: "Tasima Kurallari", icon: "📋", external: true }` ekle (hem carrier hem customer gorecek, target="_blank")
- [ ] Alternatif: panel icinde `/panel/tasima-kurallari` sayfasi olustur (CustomPageView embed). Ayrı sayfa olarak acilmasin, panel icinde goruntule.

Karar: **Panel icinde embed** — daha iyi UX, kullanici panel'den cikmaz.

- [ ] `app/panel/tasima-kurallari/page.tsx` — CustomPageView ile slug `tasima-kurallari` render
- [ ] `panel/layout.tsx` — NAV'a `{ href: "/panel/tasima-kurallari", label: "Tasima Kurallari", icon: "📋" }` ekle (roles kısıtlaması yok, herkes gorur)

---

## CP-22G — Frontend: Kayit formunda kural onay checkbox'u

- [ ] `modules/auth/auth.schema.ts` — `registerSchema`'ya `rules_accepted: z.literal(true, { errorMap: () => ({ message: "Kuralları kabul etmeniz gerekiyor" }) })` ekle
- [ ] `app/uye-ol/page.tsx` — form state'e `rules_accepted: false` ekle; submit butonunun uzerinde:
  ```
  [x] Taşıma Kuralları ve Kullanım Koşulları'nı okudum ve kabul ediyorum.
  ```
  Her iki metin de tiklayinca yeni sekmede acilir (`/tasima-kurallari`, `/kullanim-kosullari`).
- [ ] `modules/auth/auth.service.ts` — register payload'a `rules_accepted: true` ekle (backend'e gonderilecek)

---

## CP-22H — Admin: Para cekme yonetimi

- [ ] `app/admin/cekim/page.tsx` — tum cekim talepleri listesi: kullanici, tutar, banka bilgisi, durum, tarih
  - Pending talepler: "Onayla" + "Reddet" butonlari
  - Reddet: admin_notes inputu (neden)
  - Completed/rejected kartlari: islem tarihi gosterimi
- [ ] `app/admin/layout.tsx` — nav'a `{ href: "/admin/cekim", label: "Para Cekim", icon: "🏦" }` ekle
- [ ] `modules/admin/admin.service.ts` — `adminListWithdrawals`, `adminProcessWithdrawal` fonksiyonlari

---

## Uygulama Sirasi

```
22A (DB)
  → 22B + 22C (backend, paralel)
    → 22D (frontend tipler/servisler)
      → 22E + 22F + 22G (frontend sayfalar, paralel)
        → 22H (admin panel)
          → Antigravity review
```

---

## Kritik Dosyalar

| Dosya | Islem |
|-------|-------|
| `backend/src/modules/withdrawal/` | Yeni modul (8 dosya) |
| `backend/src/modules/auth/schema.ts` | `rules_accepted_at` alan ekleme |
| `backend/src/modules/auth/controller.ts` | signup'a rules_accepted kontrolu |
| `backend/src/routes.ts` | withdrawal register |
| `frontend/src/app/panel/cuzdan/` | Tamamen yeniden yapi (page + 4 component) |
| `frontend/src/app/panel/layout.tsx` | Tasima Kurallari nav ekleme |
| `frontend/src/app/panel/tasima-kurallari/` | Yeni sayfa |
| `frontend/src/app/uye-ol/page.tsx` | Checkbox + state |
| `frontend/src/modules/auth/auth.schema.ts` | rules_accepted validation |
| `frontend/src/modules/withdrawal/` | Yeni modul (2 dosya) |
| `frontend/src/app/admin/cekim/` | Yeni admin sayfasi |
| `frontend/src/app/admin/layout.tsx` | Nav ekleme |

---

## Mimari Kararlar

1. **Para cekme: bakiye aninda duser.** Talep olusturunca bakiyeden dusulur. Admin reddederse geri yazilir. Boylece "cift harcama" onlenir.
2. **Minimum cekim tutari yok.** Kullanici istedigini ceker. (Ileride eklenebilir.)
3. **Tasima Kurallari panel icinde embed.** Kullanici panel'den cikmaz, ayri sekmede acilmaz.
4. **rules_accepted_at nullable.** Mevcut kullanicilari bozmaz. Yeni kayitlarda zorunlu.
5. **Cuzdan sayfasi role-aware.** Carrier extra "Para Cek" tab'i gorur. Musteri gormez.
6. **Withdrawal admin tarafinda manuel.** Otomatik banka transferi yok (Turkiye'de EFT/havale API entegrasyonu sonraki faz).
