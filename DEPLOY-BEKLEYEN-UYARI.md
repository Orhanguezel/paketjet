# ⚠️ DEPLOY BEKLEYEN DEGISIKLIK — 404 STATUS DUZELTMESI

**Tarih:** 2026-07-20
**Durum:** Kod duzeltildi, **commit edildi ama PUSH EDILMEDI ve DEPLOY EDILMEDI.**
**Canli site (paketjet.com) hala hatali durumda.**

---

## Ne bozuk

Site eksik sayfalar icin **HTTP 404 dondurmuyor, 200 donduruyor.** Govdede
"bulunamadi" yaziyor ama HTTP status 200 kaliyor.

Olculen (2026-07-20, canli):

| yol | status | beklenen |
|---|---|---|
| `/blog/uydurma-999` | **200** | 404 |
| `/rota/uydurma-999` | **200** | 404 |
| `/ilanlar/99999999` | **200** | 404 |

**SEO etkisi:** Google'a her kirik URL gecerli sayfa gibi gorunuyor;
kopya/ince icerik olarak indekslenebilir.

## Kok neden

`loading.tsx`. Bir rotanin ustunde `loading.tsx` varsa Suspense siniri acilir,
Next yaniti streaming'e baslar ve **basliklari 200 olarak flush eder**.
Sonradan cagrilan `notFound()` artik sadece govdeyi degistirebilir, status'u
degistiremez.

Bu kok neden vistaseeds, tarimiklim ve hal-fiyatlari'nda olculup dogrulandi;
uc sitede de `loading.tsx` kaldirilinca 404 duzeldi.

## Yapilan degisiklik (commit edildi, push EDILMEDI)

Kaldirilan:
- `frontend/src/app/loading.tsx`          (kok — tum siteyi kapsiyordu)
- `frontend/src/app/(public)/loading.tsx`

Korunan (bilerek):
- `frontend/src/app/admin/loading.tsx`
- `frontend/src/app/panel/**/loading.tsx`

Panel/admin auth arkasinda, indekslenmiyor; iskelet yukleyici UX degeri
tasidigi icin dokunulmadi.

## ⚠️ BUILD DOGRULANMADI

Bu makinede `paketjet/frontend/node_modules` **hic kurulu degil**; build
`Cannot find module '@sentry/nextjs'` ile hemen basta patliyor. Yani
degisiklik **derlenerek dogrulanmadi.** (Hata degisiklikten once de vardi,
onunla ilgisi yok — ama yine de build gorulmedi.)

Deploy etmeden once mutlaka:

```bash
cd frontend && npm install   # veya bun install
npm run build                # exit kodu 0 olmali
```

## Deploy adimlari

paketjet bu workspace'in ana VPS'inde (`vps-vistainsaat`) **degil** — deploy
akisi (sunucu, PM2 process adi, env korumasi) cikarilmadi. Once o tespit
edilmeli.

```bash
git push origin main         # <-- henuz yapilmadi
# sonra sunucuda: pull -> npm ci -> npm run build -> process restart
```

## Deploy sonrasi dogrulama

```bash
for p in /blog/uydurma-999 /rota/uydurma-999 /ilanlar/99999999; do
  printf "%-24s -> " "$p"
  curl -sL -o /dev/null -w '%{http_code}\n' "https://paketjet.com$p"
done
# ucu de 404 vermeli

curl -sL -o /dev/null -w '%{http_code}\n' https://paketjet.com/        # 200 kalmali
```

Hepsi 404 donuyorsa bu dosya silinebilir.

---

**Referans:** Ayni duzeltmenin uygulandigi projeler — vistaseeds (`7e2c114`),
tarimiklim (`38453f5`), hal-fiyatlari (`492819c4`). bereketfide'de hic
`loading.tsx` yok, dogru davranis icin referans alinabilir.
