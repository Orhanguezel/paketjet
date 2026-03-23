# PaketJet Backend

Bu servis PaketJet projesinin backend API katmanidir.

Gelistirme kurallari icin:

- [BACKEND_RULES.md](/home/orhan/Documents/Projeler/paketjet/backend/BACKEND_RULES.md)
- [CLAUDE.md](/home/orhan/Documents/Projeler/paketjet/backend/CLAUDE.md)

Temel yapi:

- Bun runtime
- Fastify
- MySQL / MariaDB
- JWT tabanli auth
- site settings, ilan, booking, wallet, admin ve audit modulleri

## Calistirma

### 1. Env dosyasini olustur

```bash
cp .env.example .env
```

### 2. Veritabanini hazirla

Lokal docker-compose kullanacaksan:

```bash
docker compose up -d db
```

Bu compose varsayilan olarak sunlari kullanir:

- `DB_NAME=paketjet`
- `DB_USER=app`
- `DB_PASSWORD=app`

### 3. Backend'i baslat

```bash
bun run dev
```

## Sik Gorülen Hata

### `Access denied for user 'app'@'localhost' to database 'paketjet'`

Anlami:

- backend `.env` icinde `DB_USER=app`, `DB_PASSWORD=app`, `DB_NAME=paketjet` ile acilmaya calisiyor
- ama MySQL tarafinda bu kullanicinin `paketjet` veritabanina yetkisi yok

Iki cozum yolu var.

### Cozum 1: Kullaniciya yetki ver

```sql
CREATE DATABASE IF NOT EXISTS paketjet;
CREATE USER IF NOT EXISTS 'app'@'localhost' IDENTIFIED BY 'app';
GRANT ALL PRIVILEGES ON paketjet.* TO 'app'@'localhost';
FLUSH PRIVILEGES;
```

### Cozum 2: `.env` icindeki DB kullanicisini mevcut kullaniciya gore degistir

Ornek:

```env
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=paketjet
```

## Env Notlari

Guncel beklenti:

- `src/core/env.ts` fallback olarak `DB_NAME=paketjet` kullanir
- local compose `app/app/paketjet` kombinasyonuna gore ayarlidir
- `.env.example` bu local gelistirme akisini referans alir

Storage:

- `STORAGE_DRIVER=local` veya `cloudinary`
- local modda `LOCAL_STORAGE_ROOT` ve `LOCAL_STORAGE_BASE_URL` gerekir
- cloudinary modda `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` gerekir

## Gelistirme Notlari

- `.env` icine gercek secret koyuyorsan bu dosya commit edilmemeli
- prod ayarlari local defaultlarla karistirilmamali
- local backend ve admin panel ayni API base URL'e bakmali

## Dogrulama

Backend ayarlarini degistirdikten sonra su akis yeterlidir:

```bash
bun run dev
```

Beklenen:

- server DB'ye baglanir
- `localhost:8078` uzerinde ayaga kalkar
- auth ve admin endpoint'leri cevap vermeye baslar
