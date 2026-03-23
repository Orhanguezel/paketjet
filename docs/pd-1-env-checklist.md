# PD-1 Environment Checklist

Bu dosya production'a cikmadan once doldurulacak ortam degiskenlerini tek yerde toplar.
Gercek secret'lari bu dosyaya yazma. Sadece hangi anahtarin nerede kullanildigini takip etmek icin kullan.

---

## 1. Backend `.env`

Dosya: `backend/.env`

Hazir taslak:
- [ ] `backend/.env.production.example` dosyasini kopyalayip production `.env` olustur

### Genel
- [ ] `NODE_ENV=production`
- [ ] `PORT=8083` veya deploy topolojine uygun port
- [ ] `SENTRY_DSN=...`

### Veritabani
- [ ] `DB_HOST=...`
- [ ] `DB_PORT=3306`
- [ ] `DB_NAME=paketjet`
- [ ] `DB_USER=...`
- [ ] `DB_PASSWORD=...`
- [ ] `DB_ROOT_USER=...`
- [ ] `DB_ROOT_PASSWORD=...`

### Redis
- [ ] `REDIS_URL=redis://...`
- [ ] `REDIS_HOST=...`
- [ ] `REDIS_PORT=6379`
- [ ] `REDIS_PASSWORD=...`

### Auth / Cookie
- [ ] `JWT_SECRET=` en az 32+ karakter guclu random deger
- [ ] `COOKIE_SECRET=` ayri ve guclu random deger
  Komut onerisi:
  `openssl rand -base64 64`

### URL'ler
- [ ] `PUBLIC_URL=https://api.paketjet.com`
- [ ] `FRONTEND_URL=https://paketjet.com`
- [ ] `PUBLIC_API_BASE=https://api.paketjet.com`

### CORS
- [ ] `CORS_ORIGIN=https://paketjet.com,https://admin.paketjet.com`

### Storage
- [ ] `STORAGE_DRIVER=cloudinary` veya secilen storage driver
- [ ] `LOCAL_STORAGE_ROOT` productionda local storage kullaniliyorsa dolu
- [ ] `LOCAL_STORAGE_BASE_URL` productionda local storage kullaniliyorsa dolu
- [ ] `CLOUDINARY_CLOUD_NAME=...`
- [ ] `CLOUDINARY_API_KEY=...`
- [ ] `CLOUDINARY_API_SECRET=...`
- [ ] `CLOUDINARY_UNSIGNED_PRESET=...`
- [ ] `CLOUDINARY_UPLOAD_PRESET=...`
- [ ] `CLOUDINARY_FOLDER=paketjet`
- [ ] `CLOUDINARY_BASE_PUBLIC=...`

### SMTP / Mail
- [ ] `SMTP_HOST=...`
- [ ] `SMTP_PORT=465` veya provider degeri
- [ ] `SMTP_SECURE=true`
- [ ] `SMTP_USER=...`
- [ ] `SMTP_PASS=...`
- [ ] `MAIL_FROM=PaketJet <noreply@paketjet.com>`

### OAuth / Harici servisler
- [ ] `GOOGLE_CLIENT_ID=...`
- [ ] `GOOGLE_CLIENT_SECRET=...`
- [ ] `GOOGLE_MAPS_API_KEY=...`
- [ ] `IYZICO_API_KEY=...`
- [ ] `IYZICO_SECRET_KEY=...`
- [ ] `IYZICO_BASE_URL=https://api.iyzipay.com`

### Seed / Gelistirme ayarlari
- [ ] `ALLOW_TEMP_LOGIN=0`
- [ ] `TEMP_PASSWORD` productionda kapatildi veya anlamsiz bir deger verildi
- [ ] `ADMIN_EMAIL=...`
- [ ] `ADMIN_PASSWORD=...`
- [ ] `SEED_ADMIN_EMAIL=...`
- [ ] `SEED_ADMIN_PASSWORD=...`
- [ ] `CARRIER_EMAIL=...`
- [ ] `CARRIER_PASSWORD=...`
- [ ] `CARRIER_ID=...`

---

## 2. Frontend `.env.local`

Dosya: `frontend/.env.local`

Hazir taslak:
- [ ] `frontend/.env.production.example` dosyasini kopyalayip production `.env.local` olustur

- [ ] `NEXT_PUBLIC_API_URL=https://api.paketjet.com`
- [ ] `NEXT_PUBLIC_SITE_URL=https://paketjet.com`
- [ ] `NEXT_PUBLIC_SENTRY_DSN=...`
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...`

Not:
- `NEXT_PUBLIC_` ile baslayan degiskenler browser'a gider. Secret koyma.

---

## 3. Admin Panel `.env`

Dosya: `admin_panel/.env`

Hazir taslak:
- [ ] `admin_panel/.env.production.example` dosyasini kopyalayip production `.env` olustur

- [ ] `PANEL_API_URL=https://api.paketjet.com`
- [ ] `NEXT_PUBLIC_API_URL=https://api.paketjet.com/api`
- [ ] `NEXT_PUBLIC_API_BASE_URL=https://api.paketjet.com/api`
- [ ] `NEXT_PUBLIC_MEDIA_URL=https://api.paketjet.com/api`
- [ ] `NEXT_PUBLIC_SOCKET_URL=https://api.paketjet.com`
- [ ] `NEXT_PUBLIC_SITE_URL=https://admin.paketjet.com`
- [ ] `PLAYWRIGHT_BASE_URL=https://paketjet.com`
- [ ] `NEXT_PUBLIC_APP_ENV=production` veya ekip standardi
- [ ] `NEXT_PUBLIC_SITE_BRAND=paketjet`
- [ ] `NEXT_PUBLIC_GTM_*` gerekiyorsa production container ID ile guncel
- [ ] `NEXT_PUBLIC_GA_ID` gerekiyorsa production measurement ID ile guncel
- [ ] `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` production site key ile guncel

Not:
- Admin paneldeki `NEXT_PUBLIC_*` alanlari da client'a aciktir. Secret koyma.

---

## 4. Guvenlik Kontrolu

- [ ] Repo icinde gercek secret kalmadi
- [ ] `.env.example` dosyalarinda sadece placeholder var
- [ ] Frontend ve admin `NEXT_PUBLIC_*` degiskenlerinde secret yok
- [ ] Iyzico production key sadece backend `.env` icinde
- [ ] SMTP sifresi sadece backend `.env` icinde
- [ ] `JWT_SECRET` ve `COOKIE_SECRET` farkli degerler
- [ ] Gerekirse eski test key'ler rotate edildi

---

## 5. Hizli Dogrulama

### Backend
- [ ] `cd backend && bun run build`
- [ ] `cd backend && bun run dev`
- [ ] `curl https://api.paketjet.com/api/health`

### Frontend
- [ ] `cd frontend && bun run build`
- [ ] Harita kullanan sayfalarda Google Maps yukleniyor
- [ ] Sentry init oluyor ama DSN expose sorunu yok

### Admin Panel
- [ ] `cd admin_panel && bun run build`
- [ ] Login ve API istekleri production API'ye gidiyor

---

## 6. Son Karar

- [ ] Production deploy icin env hazir
- [ ] Uptime Kuma kurulumuna gecebilir
- [ ] Antigravity dogrulamasina gecebilir
