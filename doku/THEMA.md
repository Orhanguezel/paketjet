# THEMA.md

## Amac

Bu dokuman, PaketJet frontend icin dinamik tokenlarla kontrol edilen, light/dark modda tutarli calisan ve component seviyesinde hardcoded renk kullanimini engelleyen tema contract'ini tanimlar.

Hedef:

- light / dark mode'u ilk boyamada dogru uygulamak
- semantic token katmanini tek kaynak haline getirmek
- Tailwind v4 tokenlari ile raw CSS tokenlarini senkron tutmak
- componentlerin mode, preset veya marka detayi bilmeden calismasini saglamak
- ileride yeni marka varyanti veya kampanya temasi gelirse sadece root override ile yonetebilmek

## PaketJet Referansi

PaketJet frontend'de tema sistemi su dosyalara dayanir:

- global token kaynagi:
  - `frontend/src/app/globals.css`
- root layout ve hydration contract'i:
  - `frontend/src/app/layout.tsx`
- theme provider:
  - `frontend/src/providers/theme-provider.tsx`
- PostCSS / Tailwind v4 girisi:
  - `frontend/postcss.config.mjs`

Bu dokuman bu dosyalarin nasil evrilecegini belirler.

## PaketJet Icin Temel Prensipler

### 1. Theme mode root contract'tir

PaketJet'te tema root seviyede uygulanir.

Gecerli contract:

- `html[data-theme="light"]`
- `html[data-theme="dark"]`
- `document.documentElement.style.colorScheme = "light|dark"`

Kurallar:

- mode state'i component icinde tutulmaz
- component `if (dark)` mantigi yazmaz
- `dark:` varyanti zorunlu degil; asil referans semantic token'dir
- ilk boyamada dogru mode gorunmeli, hydration sonrasi flicker kabul edilmez

### 2. Token katmani 3 seviyeli olmalidir

#### Katman A: Primitive / ham tokenlar

Bu katman palet degerlerini tutar.

Ornek:

- `--col-brand`
- `--col-brand-dark`
- `--col-brand-light`
- `--col-foreground`
- `--col-muted`
- `--col-border`
- `--col-surface`
- `--col-bg`
- `--col-bg-alt`
- `--col-success`
- `--col-danger`
- `--col-navy`

Bu tokenlar component'te dogrudan son tercih olarak bile kullanilmaz; semantic katmani besler.

#### Katman B: Semantic tokenlar

Bu katman UI'nin gercek contract'idir.

PaketJet zorunlu semantic token seti:

- `--color-background`
- `--color-surface`
- `--color-bg-alt`
- `--color-foreground`
- `--color-muted`
- `--color-faint`
- `--color-border`
- `--color-border-soft`
- `--color-brand`
- `--color-brand-dark`
- `--color-brand-light`
- `--color-brand-xlight`
- `--color-success`
- `--color-success-bg`
- `--color-warning`
- `--color-danger`
- `--color-danger-bg`
- `--color-info`
- `--color-navy`
- `--color-navy-mid`
- `--color-navy-soft`

Bu tokenlar Tailwind v4 `@theme` icinde tanimli olmali ve utility class olarak kullanilabilmelidir.

#### Katman C: Surface / pattern utility'leri

Tekrarlanan yuzeyler utility veya ortak component contract'i ile yasar.

Zorunlu pattern isimleri:

- `surface-page`
- `surface-card`
- `surface-card-muted`
- `surface-elevated`
- `surface-input`
- `surface-hero-overlay`
- `surface-dark-shell`
- `surface-brand-cta`
- `text-heading-on-dark`
- `text-body-on-dark`
- `ring-brand-focus`

Not:

- Bunlar ister `@utility` ile ister ortak React component ile uygulanabilir.
- Ayni border/bg/text kombinasyonu birden fazla yerde tekrar ediyorsa ham class degil pattern kullanilir.

### 3. Theme provider tek uygulama noktasi olmalidir

Su an `next-themes` ile `attribute="data-theme"` kullaniliyor. Bu dogru temel.

Kurallar:

- tema degisimi yalnizca provider veya tek utility uzerinden yapilir
- DOM manipule eden ikinci bir helper da asil contract'i bozmamali
- sayfa/component icinde `document.documentElement.setAttribute(...)` yazilmaz
- storage key, mode listesi ve default theme tek yerde tanimli olur

### 4. Preset / template destegi root override ile gelmelidir

PaketJet bugun icin tek marka diline sahip, ama ileride farkli gorunum ihtiyaclari dogabilir:

- kampanya landing page
- kurumsal sade tema
- yuksek kontrast erisilebilir preset
- partner white-label varyanti

Bu durumda contract:

- `data-theme` mode icin kalir
- opsiyonel ikinci root attribute eklenir: `data-theme-preset`

Ornek:

- `html[data-theme="light"][data-theme-preset="default"]`
- `html[data-theme="dark"][data-theme-preset="express"]`

Kural:

- preset component logic'i degistirmez
- sadece token degerlerini override eder
- componentler preset ismi bilmez

### 5. Tailwind tokenlari ile raw CSS tokenlari senkron olmak zorundadir

PaketJet'te iki katman birlikte calisiyor:

- `@theme` icindeki Tailwind tokenlari
- `:root` ve `[data-theme="dark"]` icindeki raw CSS tokenlari

Bu ikisi farkli yonlere sapmamalidir.

Kural:

- bir semantic renk eklendiyse hem `@theme` hem root token katmaninda iz dusumu olmali
- `bg-brand`, `text-foreground`, `border-border` gibi class'lar ile `hsl(var(--col-brand))` gibi dogrudan CSS kullanimi ayni semantige oturmalidir
- tek tarafli token tanimi yapilmaz

## PaketJet Icin Yasaklar

Asagidakiler tema contract'ini bozar:

- `bg-white`, `text-black`, `border-gray-200` gibi semantic katman disi hardcoded surface kullanimi
- `dark:bg-slate-900` + `bg-white` seklinde ikili class zinciri ile componenti mode'a baglamak
- component icinde hex / hsl / rgb yazmak
- ayni CTA'nin bir yerde turuncu bir yerde yesil ama rastgele kararlarla kullanilmasi
- sayfa bazinda bagimsiz renk kararlarinin component icinde gomulu olmasi

Istisnalar:

- medya overlay
- partner logo alanlari
- status grafik / chart renkleri
- marka illustasyonlari

Bu istisnalarda bile once semantic alias tanimlanir.

## PaketJet Semantic Kullanım Kurallari

### 1. Page / shell

- sayfa zemini: `bg-background`
- kart veya form zemini: `bg-surface`
- alternatif section zemini: `bg-bg-alt`
- birincil metin: `text-foreground`
- ikincil metin: `text-muted`
- yardimci metin: `text-faint`
- ana border: `border-border`
- yumusak border: `border-border-soft`

### 2. Marka / CTA

- ana CTA: `bg-brand hover:bg-brand-dark text-white`
- ikincil brand tint: `bg-brand-light text-brand`
- success aksiyonu: `bg-success text-white`
- success tint: `bg-success-bg text-success`

Kural:

- turuncu marka aksiyonu icin
- yesil tamamlama / satin alma / olumlu durum icin
- ayni anlami tasiyan butonlar farkli renk ailesine dagitilmaz

### 3. Koyu alanlar

Hero, footer veya karanlik panel gibi alanlarda ayrik semantic alan kullanilir:

- zemin: `bg-navy` veya `bg-navy-mid`
- baslik: `text-white` yerine `text-heading-on-dark` benzeri ortak utility
- paragraf: `text-body-on-dark` utility
- border / overlay ayrica semantic alias ile tanimlanir

### 4. Form ve input contract'i

Tum inputlar ayni yuzeyi kullanir:

- `bg-surface`
- `border-border`
- `text-foreground`
- `placeholder:text-faint`
- `focus-visible` marka ring

Input bazli farkli gri ton denemeleri yasaktir.

## Dinamik Token Yonetimi Icin Onerilen Yapı

Asagidaki yapi PaketJet'e ozel olarak onerilir:

### A. Token registry

`frontend/src/lib/theme/` altinda su dosyalar tutulabilir:

- `theme.types.ts` — mode ve preset tipleri
- `theme.constants.ts` — storage key, default mode, preset listesi
- `theme.presets.ts` — preset override map'i
- `theme.utils.ts` — root apply helper'lari

### B. Root apply contract

Tek apply akisi sunlari yapar:

- `data-theme` set eder
- gerekiyorsa `data-theme-preset` set eder
- `color-scheme` gunceller
- tercihi persist eder
- gerekiyorsa token override'larini CSS variable olarak root'a yazar

### C. Theme toggle contract

Toggle'in isi sadece sunlardir:

- mode degistirmek
- preset degistirmek
- kullanici tercihini kaydetmek

Toggle'in isi olmayan seyler:

- component class listesi degistirmek
- sayfa ozel renk override etmek
- tek component icin baska branch acmak

## PaketJet Bilesen Katalogu

Ilk etapta tum yeni bilesenler su tema contract'ine gore yazilmalidir:

- `Header`
- `HeroSearch`
- `IlanCard`
- `Button`
- `Input`
- `Badge`
- `FilterBar`
- `SectionHeader`
- `StatsCard`
- `PanelShell`

Bu bilesenlerde kural:

- raw renk yok
- hardcoded gri palet yok
- status renkleri semantic token uzerinden
- ayni yuzey kurallari tekrar tekrar yazilmaz

## PaketJet Icin Test Kurallari

### 1. Tema smoke test

Asagidaki hatalar yakalanmali:

- `bg-white`, `text-black`, `border-gray-*` gibi hardcoded renkler
- component icinde hex / hsl / rgb kullanimi
- `dark:` ile semantic token'in yerini alan gecici cozumler
- `data-theme` disinda ikinci gizli mode mekanizmasi

### 2. UI dogrulama

Kritik route'larda su kontroller yapilir:

- `/`
- `/ilanlar`
- `/giris`
- `/uye-ol`
- ileride `/panel/*`

Kontroller:

- root'ta `data-theme` var mi
- body ve page shell beklenen semantic zeminleri kullaniyor mu
- CTA renk ailesi tutarli mi
- input ve kart yuzeyleri ayni semantic kontratta mi
- dark mode'da text / border kontrasti kiriliyor mu

### 3. Build kontrolu

Release oncesi:

- `bun run build`
- kritik sayfalarda HTML icinde stylesheet link'i var mi
- CSS cikti dosyasinda beklenen token utility'leri uretilmis mi

## PaketJet Icin Uygulama Plani

### Phase 1 — Contract'i sabitle

- `globals.css` icinde primitive + semantic tokenlari netlestir
- eksik surface utility'leri ekle
- `data-theme` ve `color-scheme` apply akisini tek noktada sabitle

### Phase 2 — Bilesenleri token contract'ine cek

- `Header`, `HeroSearch`, `IlanCard`, `Button`, `Input`, `Badge`
- tum kart/form/buton varyantlarini semantic token tabanli hale getir

### Phase 3 — Preset destegini hazirla

- `data-theme-preset` contract'ini ekle
- en az `default` ve `express` preset yapisini kur
- preset gelmeden component API'sini bozmadan altyapiyi hazir tut

### Phase 4 — Guardrail ekle

- grep tabanli hardcoded color kontrolu
- tema smoke test
- yeni componentlerde token disi kullanimlari fail ettiren review kurali

## Bu Dokumana Gore Sonraki Is

PaketJet icin tema sistemi su sekilde ilerlemelidir:

1. `THEMA.md` contract'ine gore `globals.css` token setini normalize etmek
2. ortak `Button`, `Input`, `Badge`, `PanelShell` surface contract'larini cikarmak
3. theme mode + preset uygulamasini `lib/theme` altinda merkezilestirmek
4. landing, listing ve auth sayfalarini ayni semantic sistemle hizalamak
