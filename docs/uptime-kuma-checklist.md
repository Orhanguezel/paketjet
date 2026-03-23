# IG-2 Uptime Kuma Checklist

Bu dosya production sonrasi temel monitoring kurulumunu adim adim takip etmek icin kullanilir.

---

## 1. Uptime Kuma Kurulumu

- [ ] VPS'e SSH ile baglanildi
- [ ] Docker calisiyor
- [ ] `3001` portu uygun veya reverse proxy plani hazir
- [ ] Uptime Kuma container'i calisti

Komut:

```bash
docker run -d \
  --name uptime-kuma \
  --restart=always \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma
```

Kontrol:

```bash
docker ps
curl http://127.0.0.1:3001
```

---

## 2. Ilk Erisim

- [ ] `http://VPS_IP:3001` acildi
- [ ] Admin kullanicisi olusturuldu
- [ ] Guclu sifre tanimlandi
- [ ] Varsa 2FA plani not edildi

---

## 3. Eklenecek Monitorler

### HTTP / HTTPS
- [ ] `PaketJet Backend Health`
  URL: `https://api.paketjet.com/api/health`
  Type: `HTTP(s)`
  Expected status: `200`
  Keyword kontrolu: `status`

- [ ] `PaketJet Frontend`
  URL: `https://paketjet.com`
  Type: `HTTP(s)`
  Expected status: `200`

- [ ] `PaketJet Admin`
  URL: `https://admin.paketjet.com`
  Type: `HTTP(s)`
  Expected status: `200`

### TCP
- [ ] `MySQL TCP`
  Host: `127.0.0.1` veya DB host
  Port: `3306`
  Type: `TCP Port`

Opsiyonel:
- [ ] `Redis TCP`
  Host: `127.0.0.1` veya Redis host
  Port: `6379`
  Type: `TCP Port`

---

## 4. Monitor Ayarlari

Her HTTP monitor icin onerilen ayarlar:
- [ ] Interval: `60` saniye
- [ ] Retry / Max retries: `3`
- [ ] Timeout: `10` saniye
- [ ] Follow redirects: acik
- [ ] SSL expiry alert: acik

MySQL / Redis TCP monitor icin:
- [ ] Interval: `60` saniye
- [ ] Retry / Max retries: `3`
- [ ] Timeout: `10` saniye

---

## 5. Notification Kanallari

### Telegram
- [ ] Telegram bot token hazir
- [ ] Chat ID hazir
- [ ] Uptime Kuma icinde Telegram notification eklendi
- [ ] Test mesaj basarili gitti

### Email
- [ ] SMTP host hazir
- [ ] SMTP port hazir
- [ ] SMTP user/pass hazir
- [ ] From email ayarlandi
- [ ] Test mail basarili gitti

---

## 6. Alert Kurallari

- [ ] 3 basarisiz check sonrasi bildirim aktif
- [ ] Recovery notification aktif
- [ ] SSL expiry bildirimi aktif
- [ ] Bildirimler backend, frontend, admin ve DB monitorlerine baglandi

---

## 7. Hizli Dogrulama

- [ ] Backend health monitor green
- [ ] Frontend monitor green
- [ ] Admin monitor green
- [ ] MySQL monitor green
- [ ] Opsiyonel Redis monitor green

Manuel endpoint kontrolu:

```bash
curl -i https://api.paketjet.com/api/health
curl -I https://paketjet.com
curl -I https://admin.paketjet.com
```

---

## 8. Son Kapanis

- [ ] Screenshot veya not alindi
- [ ] `docs/orkestra-sefi-rehberi.md` icindeki `IG-2` operator adimi tamam sayilabilir
- [ ] Antigravity dogrulamasina gecilebilir
