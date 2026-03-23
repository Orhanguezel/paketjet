# Uptime Kuma Komutlari

Bu dosya IG-2 icin hizli operasyon komutlarini toplar.

---

## 1. Container baslat

```bash
docker run -d \
  --name uptime-kuma \
  --restart=always \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma
```

## 2. Durum kontrolu

```bash
docker ps --filter name=uptime-kuma
docker logs --tail 100 uptime-kuma
```

## 3. Yeniden baslat

```bash
docker restart uptime-kuma
```

## 4. Durdur / sil

```bash
docker stop uptime-kuma
docker rm uptime-kuma
```

## 5. Health URL kontrolu

```bash
curl -i https://api.paketjet.com/api/health
```

## 6. Site kontrolu

```bash
curl -I https://paketjet.com
curl -I https://admin.paketjet.com
```
