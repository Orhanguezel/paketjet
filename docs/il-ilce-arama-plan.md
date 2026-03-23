# PaketJet -- Il/Ilce Aranabilir Dropdown Mimari Plan

Tarih: 2026-03-21
Hazirlayan: Claude Code (mimari)
Uygulayici: Codex (frontend)
Dogrulayici: Antigravity (gorsel + fonksiyonel)

---

## 1. Kapsam

`/ilan-ver` sayfasindaki Step 0 (Guzergah) alanlarini duz `<Input>` yerine aranabilir dropdown'a donusturmek:

| Alan | Mevcut | Hedef |
|------|--------|-------|
| Kalkis Sehri | Serbest text input | Aranabilir dropdown (81 il) |
| Varis Sehri | Serbest text input | Aranabilir dropdown (81 il) |
| Kalkis Ilcesi | Serbest text input | Aranabilir dropdown (secili ile gore ilceler) |
| Varis Ilcesi | Serbest text input | Aranabilir dropdown (secili ile gore ilceler) |

**Veri kaynagi:** `frontend/src/data/turkey-cities.ts` (81 il + ilceleri, kamanilan reposundan kopyalandi)

---

## 2. Bilesen Mimarisi

### 2.1 SearchableSelect Bileseni (YENi)

Genel amacli, tekrar kullanilabilir dropdown:

```
frontend/src/components/ui/SearchableSelect.tsx
```

**Props:**

```typescript
interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}
```

**Davranis:**

1. Input'a tiklaninca veya yazilinca dropdown acilir
2. Yazilan metin secenekleri filtreler (case-insensitive, Turkce karakter uyumlu)
3. Bir secenek tiklaninca secilir, dropdown kapanir
4. Secili deger input'ta gosterilir
5. Input temizlenince (x butonu veya tum text silinince) secim sifirlanir
6. Dropdown disina tiklaninca kapanir (click outside)
7. Klavye destegi: Arrow Up/Down ile gezinme, Enter ile secim, Escape ile kapatma

**UI Tasarim Kurallari:**

- Mevcut `Input` bileseninin stil kalibini kullanir (ayni border, focus ring, padding)
- Dropdown: `bg-surface`, `border-border-soft`, `rounded-lg`, `shadow-lg`
- Hover: `bg-brand/10`
- Secili: `bg-brand text-white`
- Max yukseklik: `max-h-60 overflow-y-auto`
- Token siniflari kullanilir (hex/hsl direkt yok)

### 2.2 Turkce Karakter Normalizasyonu

Arama sirasinda Turkce ozel karakterler normalize edilir:

```typescript
function normalizeSearch(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
}
```

Bu fonksiyon `SearchableSelect` icinde tanimlanir. "ist" yazinca "Istanbul" bulunur, "cankiri" yazinca "Cankiri" bulunur.

### 2.3 Barrel Export

`components/ui/index.ts` dosyasina eklenir:

```typescript
export { SearchableSelect } from "./SearchableSelect";
```

---

## 3. Entegrasyon: ilan-ver/page.tsx

### 3.1 Step 0 Degisiklikleri

Mevcut 4 adet `<Input>` yerine:

```
Kalkis Sehri  -> <SearchableSelect options={cityOptions} />
Varis Sehri   -> <SearchableSelect options={cityOptions} />
Kalkis Ilcesi -> <SearchableSelect options={fromDistrictOptions} disabled={!from_city} />
Varis Ilcesi  -> <SearchableSelect options={toDistrictOptions}   disabled={!to_city} />
```

### 3.2 Ilce Filtreleme Mantigi

```typescript
import { TURKEY_CITIES } from "@/data/turkey-cities";

// Il secenekleri (sabit)
const cityOptions = TURKEY_CITIES.map(c => ({ value: c.value, label: c.label }));

// Ilce secenekleri (secili ile bagli)
const fromDistricts = TURKEY_CITIES.find(c => c.value === form.from_city)?.districts ?? [];
const fromDistrictOptions = fromDistricts.map(d => ({ value: d, label: d }));

const toDistricts = TURKEY_CITIES.find(c => c.value === form.to_city)?.districts ?? [];
const toDistrictOptions = toDistricts.map(d => ({ value: d, label: d }));
```

### 3.3 Il Degistiginde Ilce Sifirlama

Il secimi degistiginde ilgili ilce sifirlanir:

```typescript
// from_city degistiginde:
update({ from_city: value, from_district: "" });

// to_city degistiginde:
update({ to_city: value, to_district: "" });
```

### 3.4 Form Validation

Step 0 "Ileri" butonu validation degismez:
- `from_city` ve `to_city` zorunlu (mevcut kural ayni kalir)
- `from_district` ve `to_district` opsiyonel (mevcut kural ayni kalir)

---

## 4. Dosya Haritasi

### Yeni Dosyalar

| Dosya | Aciklama |
|-------|----------|
| `frontend/src/data/turkey-cities.ts` | 81 il + ilceleri (KOPYALANDI) |
| `frontend/src/components/ui/SearchableSelect.tsx` | Aranabilir dropdown bileseni |

### Degisecek Dosyalar

| Dosya | Degisiklik |
|-------|------------|
| `frontend/src/components/ui/index.ts` | `SearchableSelect` export eklenir |
| `frontend/src/app/ilan-ver/page.tsx` | Step 0: Input -> SearchableSelect, ilce filtreleme |

---

## 5. Teknik Notlar

1. **3rd party kutuphane YOK.** Sifirdan yazilir, proje bagimliligi artmaz.
2. **SSR uyumlu.** `"use client"` sadece `SearchableSelect` icinde (ilan-ver zaten client).
3. **Mobil uyumlu.** Dropdown touch ile de calisir, scroll engellenmez.
4. **Performans.** 81 il + max ~40 ilce. Sanal liste (virtualization) gereksiz.
5. **Erisilebilirlik.** `role="listbox"`, `aria-expanded`, `aria-activedescendant` eklenir.
