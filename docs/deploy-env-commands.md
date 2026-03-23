# Deploy Oncesi Env Komutlari

Bu komutlar production env dosyalarini sifirdan hazirlamak icin kullanilir.
Gercek secret degerleri komut icinde tutma. Dosyalari olusturup sonra editor ile doldur.

---

## 1. Template dosyalarini kopyala

```bash
cd /home/orhan/Documents/Projeler/paketjet

cp backend/.env.production.example backend/.env
cp frontend/.env.production.example frontend/.env.local
cp admin_panel/.env.production.example admin_panel/.env
```

---

## 2. Guclu secret uret

`JWT_SECRET` ve `COOKIE_SECRET` icin:

```bash
openssl rand -base64 64
openssl rand -base64 64
```

Not:
- Ilk ciktiyi `JWT_SECRET` olarak kullan
- Ikinci ciktiyi `COOKIE_SECRET` olarak kullan
- Ikisi ayni olmamali

---

## 3. Dosyalari duzenle

Ornek:

```bash
nano backend/.env
nano frontend/.env.local
nano admin_panel/.env
```

Veya editor kullan:

```bash
code backend/.env frontend/.env.local admin_panel/.env
```

---

## 4. Backend hizli kontrol

```bash
cd /home/orhan/Documents/Projeler/paketjet/backend
bun run build
```

Health endpoint icin:

```bash
curl https://api.paketjet.com/api/health
```

---

## 5. Frontend hizli kontrol

```bash
cd /home/orhan/Documents/Projeler/paketjet/frontend
bun run build
```

Kontrol:
- API istekleri `https://api.paketjet.com` adresine gidiyor mu
- Google Maps yukleniyor mu
- Sentry init oluyor mu

---

## 6. Admin panel hizli kontrol

```bash
cd /home/orhan/Documents/Projeler/paketjet/admin_panel
bun run build
```

Kontrol:
- Login calisiyor mu
- API istekleri `https://api.paketjet.com/api` adresine gidiyor mu

---

## 7. Guvenlik son kontrol

```bash
cd /home/orhan/Documents/Projeler/paketjet
rg -n "AIza|sk-|GOCSPX|smtp|secret|password|token" backend/.env frontend/.env.local admin_panel/.env
```

Bu komut bir bulgu verirse manuel kontrol et:
- Backend dosyasinda secret olmasi normal olabilir
- `frontend/.env.local` ve `admin_panel/.env` icinde private secret olmamali

---

## 8. Siradaki adim

Env'ler tamamlaninca:
- `docs/pd-1-env-checklist.md` uzerinden kutulari isaretle
- `IG-2` icin Uptime Kuma kurulumuna gec
- Sonra Antigravity dogrulamasini calistir
