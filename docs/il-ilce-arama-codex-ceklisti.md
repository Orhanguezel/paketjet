# Il/Ilce Aranabilir Dropdown — Codex & Antigravity Ceklisti

Tarih: 2026-03-21
Mimari: Claude Code
Referans: `docs/il-ilce-arama-plan.md`

---

## Codex Gorevleri

### IA-1: SearchableSelect Bileseni

Durum: [x] Tamamlandi

**Sandbox:** frontend
**Bagimsiz:** Evet (paralel baslayabilir)

```
Prompt:

PaketJet frontend projesinde yeni bir SearchableSelect bileseni olustur.

Mimari plan: docs/il-ilce-arama-plan.md

GOREV:
1. frontend/src/components/ui/SearchableSelect.tsx olustur
2. frontend/src/components/ui/index.ts dosyasina SearchableSelect export ekle

SEARCHABLESELECT PROPS:
- label?: string
- placeholder?: string
- options: { value: string; label: string }[]
- value: string
- onChange: (value: string) => void
- error?: string
- disabled?: boolean

DAVRANIS:
- Input'a tiklaninca veya yazilinca dropdown acilir
- Yazilan metin secenekleri filtreler (case-insensitive)
- Turkce karakter normalizasyonu: "ist" yazinca "Istanbul" bulunur
  - normalizeSearch fonksiyonu: toLocaleLowerCase('tr-TR') + ı->i, g->g, u->u, s->s, o->o, c->c
- Bir secenek tiklaninca secilir, dropdown kapanir
- Secili deger input'ta gosterilir
- Input temizlenince secim sifirlanir
- Dropdown disina tiklaninca kapanir (useRef + click outside listener)
- Klavye: ArrowDown/ArrowUp gezinme, Enter secim, Escape kapatma

STIL:
- Mevcut Input bileseninin (components/ui/Input.tsx) stilini baz al
- Ayni border, focus ring, padding, rounded-lg kullan
- Dropdown: bg-surface, border-border-soft, rounded-lg, shadow-lg, max-h-60 overflow-y-auto
- Hover: bg-brand/10
- Secili secenek: bg-brand text-white
- Disabled: opacity-60, cursor-not-allowed
- Token siniflari kullan (hex/hsl direkt yazma)

ERISILEBILIRLIK:
- role="listbox" dropdown'a
- aria-expanded input'a
- aria-activedescendant aktif secenege

DOSYA LIMITI: 150 satir
"use client" direktifi gerekli.

KONTROL:
- TypeScript hata vermemeli
- Mevcut Input.tsx stiline uyumlu gorunmeli
```

---

### IA-2: ilan-ver Sayfasi Entegrasyonu

Durum: [x] Tamamlandi

**Sandbox:** frontend
**Bagimlilik:** IA-1 tamamlanmis olmali

```
Prompt:

PaketJet frontend projesinde /ilan-ver sayfasinin Step 0 (Guzergah) alanlarini
SearchableSelect bilesenine donustur.

Mimari plan: docs/il-ilce-arama-plan.md
Mevcut sayfa: frontend/src/app/ilan-ver/page.tsx
Veri dosyasi: frontend/src/data/turkey-cities.ts (81 il + ilceleri)
Bilesen: frontend/src/components/ui/SearchableSelect.tsx

GOREV:
1. frontend/src/app/ilan-ver/page.tsx dosyasini guncelle

DEGISIKLIKLER:
- Import ekle: TURKEY_CITIES from "@/data/turkey-cities"
- Import ekle: SearchableSelect from "@/components/ui"
- Il seceneklerini hazirla:
  const cityOptions = TURKEY_CITIES.map(c => ({ value: c.value, label: c.label }));
- Ilce seceneklerini secili ile gore turet:
  const fromDistricts = TURKEY_CITIES.find(c => c.value === form.from_city)?.districts ?? [];
  const fromDistrictOptions = fromDistricts.map(d => ({ value: d, label: d }));
  (ayni mantik to_city icin de)

STEP 0 ALANLARI (4 alan):
- "Kalkis Sehri *" -> SearchableSelect, options={cityOptions}, placeholder="Il secin"
  onChange: update({ from_city: value, from_district: "" })  // il degisince ilce sifirlanir
- "Varis Sehri *" -> SearchableSelect, options={cityOptions}, placeholder="Il secin"
  onChange: update({ to_city: value, to_district: "" })
- "Kalkis Ilcesi" -> SearchableSelect, options={fromDistrictOptions}, placeholder="Ilce secin"
  disabled={!form.from_city}
  onChange: update({ from_district: value })
- "Varis Ilcesi" -> SearchableSelect, options={toDistrictOptions}, placeholder="Ilce secin"
  disabled={!form.to_city}
  onChange: update({ to_district: value })

GRID LAYOUT: Mevcut 2-sutun grid ayni kalir (grid grid-cols-2 gap-3)

DOKUNMA:
- Step 1, 2, 3 degismez
- Validation degismez (from_city + to_city zorunlu, ilceler opsiyonel)
- Form state yapisi degismez (from_city, to_city, from_district, to_district string)
- Preview (Step 3) guzergah gosterimi degismez

KONTROL:
- TypeScript hata vermemeli
- Il secilince ilceler dogru gelsin
- Il degistirilince ilce sifirlansin
- Ilce secilmeden ilan verilebilsin (opsiyonel alan)
```

---

## Fraz Plani

| Fraz | Gorev | Bagimlilik |
|------|-------|------------|
| 1 | IA-1: SearchableSelect bileseni | Yok |
| 2 | IA-2: ilan-ver entegrasyonu | IA-1 |

**Toplam:** 2 Codex gorevi, sirayla (IA-1 → IA-2)

---

## Antigravity Dogrulama Ceklisti

Fraz 2 tamamlandiktan sonra Antigravity ile dogrulama:

```
Prompt:

PaketJet frontend'te /ilan-ver sayfasindaki il/ilce alanlarini kontrol et.

GORSEL KONTROL:
[ ] SearchableSelect bileseni mevcut Input ile ayni gorunumde (border, padding, focus ring)
[ ] Dropdown acilinca altinda temiz gorunuyor (shadow, border, max yukseklik)
[ ] Secili secenek farkli renkte (brand)
[ ] Hover etkisi var
[ ] Disabled durumda soluk gorunuyor
[ ] Mobilde dropdown ekrani tasmadan gorunuyor
[ ] Dark mode'da dogru renkler (data-theme="dark")

FONKSIYONEL KONTROL:
[ ] "ist" yazinca "Istanbul" listeleniyor
[ ] "ank" yazinca "Ankara" listeleniyor
[ ] Turkce karakterler: "çank" yazinca "Cankiri" listeleniyor
[ ] Il secilince ilce dropdown'i aktif oluyor
[ ] Istanbul secilince 39 ilce listeleniyor
[ ] Il degistirilince ilce sifirlaniyor
[ ] Ilce secilmeden "Ileri" basilabiliyor (opsiyonel alan)
[ ] from_city + to_city secilmeden "Ileri" basinca buton disabled
[ ] Dropdown disina tiklaninca kapaniyor
[ ] Klavye: ArrowDown ile gezinme, Enter ile secim, Escape ile kapatma
[ ] Step 3 (Onizleme) secilen il/ilce dogru gorunuyor

REGRESYON:
[ ] Step 1 (Kapasite & Tarih) degismemis
[ ] Step 2 (Iletisim) degismemis
[ ] Step 3 (Onizleme) guzergah dogru
[ ] Ilan olusturma basarili (submit)
```
