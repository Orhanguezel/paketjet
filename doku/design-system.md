# PaketJet — Design System

## Aesthetic Direction

**Corporate Logistics** — Güven, hız, profesyonellik.
- Fotoğrafik hero (gerçek kamyon/yol görselleri)
- Turuncu CTA odağı, koyu lacivert otorite aksanı
- Temiz beyaz yüzeyler, minimal gölge
- Tipografi: Bold başlıklar + okunabilir gövde

80-10-10 Kuralı: 80% neutral · 10% brand orange · 10% navy accent

---

## Renk Sistemi

Tüm renkler HSL formatında tanımlanır (Tailwind opacity modifier uyumlu).
CSS custom property adları: `--col-{isim}` (hue saturation% lightness%)

### Brand (Turuncu)
| Token           | HSL                  | HEX       | Kullanım                          |
|-----------------|----------------------|-----------|-----------------------------------|
| `--col-brand`   | `27 96% 53%`         | `#F97316` | Primary CTA, aktif tab, badge     |
| `--col-brand-dark` | `22 92% 44%`      | `#D4610B` | Hover, pressed state              |
| `--col-brand-light` | `27 96% 94%`     | `#FEE8D6` | Tint bg, soft highlight           |
| `--col-brand-xlight` | `27 96% 97%`    | `#FFF4ED` | Zebra satır, subtle accent bg     |

### Navy (Lacivert)
| Token              | HSL               | HEX       | Kullanım                          |
|--------------------|-------------------|-----------|-----------------------------------|
| `--col-navy`       | `215 68% 16%`     | `#0F2340` | Navbar bg (dark variant), footer  |
| `--col-navy-mid`   | `215 52% 26%`     | `#1F3B63` | Koyu section bg, sidebar          |
| `--col-navy-soft`  | `215 38% 36%`     | `#385880` | İkincil link, muted dark          |

### Neutral
| Token              | HSL               | HEX       | Kullanım                          |
|--------------------|-------------------|-----------|-----------------------------------|
| `--col-text`       | `215 28% 9%`      | `#0F172A` | Birincil metin                    |
| `--col-text-muted` | `215 16% 47%`     | `#64748B` | İkincil metin, placeholder        |
| `--col-text-faint` | `215 14% 66%`     | `#94A3B8` | Disabled, hint                    |
| `--col-border`     | `215 20% 88%`     | `#CBD5E1` | Input border, divider             |
| `--col-border-soft`| `215 20% 94%`     | `#E2E8F0` | Subtle divider, card border       |
| `--col-surface`    | `0 0% 100%`       | `#FFFFFF` | Kart, modal, form yüzeyi          |
| `--col-bg`         | `210 17% 98%`     | `#F8FAFC` | Sayfa arka planı                  |
| `--col-bg-alt`     | `210 17% 95%`     | `#EEF2F7` | Alt section bg, input bg          |

### Semantic
| Token              | HSL               | HEX       | Kullanım                          |
|--------------------|-------------------|-----------|-----------------------------------|
| `--col-success`    | `142 76% 36%`     | `#16A34A` | "Satın Al" butonu, onay badge     |
| `--col-success-bg` | `142 76% 95%`     | `#DCFCE7` | Başarı mesajı bg                  |
| `--col-warning`    | `38 92% 50%`      | `#F59E0B` | Uyarı badge, dikkat ikonu         |
| `--col-danger`     | `0 84% 60%`       | `#EF4444` | Hata mesajı, destructive action   |
| `--col-danger-bg`  | `0 84% 95%`       | `#FEE2E2` | Hata mesajı bg                    |
| `--col-info`       | `199 89% 48%`     | `#0EA5E9` | Bilgi badge, tracking steps       |

---

## Tipografi

### Font Stack
```
Başlıklar: "DM Sans", system-ui, sans-serif   (600-700 weight)
Gövde:     "DM Sans", system-ui, sans-serif   (400-500 weight)
Mono:      "JetBrains Mono", monospace        (tracking kodları için)
```

### Ölçek (Major Third 1.25)
| Token          | rem      | px  | Kullanım                  |
|----------------|----------|-----|---------------------------|
| `--text-xs`    | 0.75rem  | 12  | Etiket, badge, caption    |
| `--text-sm`    | 0.875rem | 14  | İkincil metin, yardımcı   |
| `--text-base`  | 1rem     | 16  | Gövde metni               |
| `--text-lg`    | 1.125rem | 18  | Lead paragraph, subtitle  |
| `--text-xl`    | 1.25rem  | 20  | Küçük başlık, kart başlığı|
| `--text-2xl`   | 1.5rem   | 24  | Section başlığı (h3)      |
| `--text-3xl`   | 2rem     | 32  | Sayfa başlığı (h2)        |
| `--text-4xl`   | 2.5rem   | 40  | Hero başlık (h1)          |
| `--text-hero`  | 3.5rem   | 56  | Büyük hero (masaüstü)     |

### Kurallar
- Başlıklarda `letter-spacing: -0.02em`
- Başlıklarda `text-wrap: balance`
- Gövde metni `max-width: 65ch`, `line-height: 1.6`
- Hero font-weight: 700, diğer başlıklar: 600

---

## Spacing (Tailwind uyumlu)

Base: 4px

| Token        | px  | Kullanım                              |
|--------------|-----|---------------------------------------|
| `--sp-1`     | 4   | İnce gap, icon padding                |
| `--sp-2`     | 8   | Küçük gap, inline badge padding       |
| `--sp-3`     | 12  | Input padding-y, chip padding         |
| `--sp-4`     | 16  | Standart gap, buton padding-x         |
| `--sp-5`     | 20  | Kart iç padding (mobil)               |
| `--sp-6`     | 24  | Kart iç padding (masaüstü)            |
| `--sp-8`     | 32  | Section gap, form alan aralığı        |
| `--sp-10`    | 40  | Büyük section separator               |
| `--sp-12`    | 48  | Hero padding-y (mobil)                |
| `--sp-16`    | 64  | Section padding-y                     |
| `--sp-20`    | 80  | Hero padding-y (masaüstü)             |
| `--sp-24`    | 96  | Büyük hero padding                    |

---

## Border Radius

| Token          | Değer   | Kullanım                              |
|----------------|---------|---------------------------------------|
| `--radius-sm`  | 4px     | Input, küçük chip                     |
| `--radius-md`  | 8px     | Buton, dropdown, küçük kart           |
| `--radius-lg`  | 12px    | Standart kart                         |
| `--radius-xl`  | 16px    | Modal, büyük kart, arama kutusu       |
| `--radius-2xl` | 24px    | Hero form paneli                      |
| `--radius-full`| 9999px  | Pill buton, badge, avatar             |

---

## Gölge (Shadow)

| Token            | Değer                                        | Kullanım             |
|------------------|----------------------------------------------|----------------------|
| `--shadow-xs`    | `0 1px 2px rgba(15,35,64,0.06)`             | Input, subtle border |
| `--shadow-sm`    | `0 2px 8px rgba(15,35,64,0.08)`             | Kart dinlenme hali   |
| `--shadow-md`    | `0 4px 16px rgba(15,35,64,0.10)`            | Kart hover           |
| `--shadow-lg`    | `0 8px 32px rgba(15,35,64,0.12)`            | Dropdown, popover    |
| `--shadow-brand` | `0 4px 16px rgba(249,115,22,0.30)`          | CTA buton gölgesi    |

---

## Bileşen Stilleri

### Butonlar

**Primary (Ana CTA)**
```
bg: --col-brand
text: white
radius: --radius-md
padding: 12px 24px
font-weight: 600
shadow: --shadow-brand (hover'da)
hover: --col-brand-dark (bg)
```

**Secondary**
```
bg: transparent
border: 1.5px solid --col-brand
text: --col-brand
radius: --radius-md
hover: --col-brand-xlight (bg)
```

**Ghost / Nav Link**
```
bg: transparent
text: --col-text
hover: --col-bg-alt (bg)
```

**Success (İlan satın al)**
```
bg: --col-success
text: white
radius: --radius-md
```

**Dark (Lacivert varyant)**
```
bg: --col-navy
text: white
hover: --col-navy-mid
```

### Input / Form
```
bg: white
border: 1px solid --col-border
radius: --radius-md
padding: 12px 16px
focus: border --col-brand, ring 3px --col-brand-light
placeholder: --col-text-faint
```

### Kart (İlan Kartı)
```
bg: --col-surface
border: 1px solid --col-border-soft
radius: --radius-lg
padding: --sp-5 (mobil) / --sp-6 (masaüstü)
shadow: --shadow-sm
hover: shadow --shadow-md, border --col-brand-light
transition: 150ms ease
```

### Navbar
```
bg: white (light) / --col-navy (dark variant)
border-bottom: 1px solid --col-border-soft
height: 64px
sticky, z-50
```

---

## Dark Mode

Dark tema `data-theme="dark"` attribute ile aktifleşir (class değil).
Tailwind `darkMode: ['attribute', '[data-theme="dark"]']` ile uyumlu.

Temel dönüşümler:
- `--col-bg` → `#0A0F1E`
- `--col-surface` → `#111827`
- `--col-text` → `#F1F5F9`
- `--col-border` → `#1E293B`
- `--col-brand` aynı kalır (turuncu her iki modda da çalışır)
- `--col-navy` dark modda navbar olarak `#060D1A` olur

---

## Sayfa Hiyerarşisi (İlan Akışı)

```
Ana Sayfa (/)
  └── Hero: Fotoğraf + Kargo Gönder / Paket Takip / Fiyat Hesapla formu
  └── Nasıl Çalışır (3 adım)
  └── Öne Çıkan İlanlar (kart listesi)
  └── İstatistik bandı
  └── CTA section

İlanlar (/ilanlar)
  └── Filtre sidebar: rota, tarih, ağırlık, boyut
  └── İlan listesi (kart grid)
      └── Avatar | Ad (gizlenmiş) | Rota | Saat | KG-Boyut seçici | Satın Al

İlan Detay (/ilanlar/[id])
  └── Taşıyıcı profili
  └── Rota + saat
  └── Kapasite seçimi
  └── Ödeme akışı

Üye / Giriş (/auth/*)
Dashboard (/dashboard) — taşıyıcı paneli
  └── İlanlarım
  └── Siparişlerim
  └── Mesajlar
```

---

## Kullanım Kuralları

- Logo tipinde "paket" koyu lacivert, "jet" marka turuncusu
- Hero görseli her zaman gerçek fotoğraf (kamyon, yol, lojistik)
- "Satın Al" butonları her zaman `--col-success` (yeşil) — alım eylemi
- "Ara" ve "Kayıt Ol" butonları `--col-brand` (turuncu) — keşif/kayıt eylemi
- Taşıyıcı ad gizleme formatı: `A.H.` (baş harfler + nokta)
- İlan avatar: yuvarlak, illüstratif kamyoncu figürü veya baş harf avatar
