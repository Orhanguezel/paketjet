# HTTP/3 Arastirma Notu

Tarih: 2026-03-30

## Mevcut Durum

PaketJet self-hosted Next.js + Nginx reverse proxy yapisinda calisiyor. Bu repoda Nginx konfig degisikligi mimari karar gerektirdigi icin uygulanmadi.

## Bulgular

- Nginx resmi dokumani, HTTP/3/QUIC desteginin `1.25.0` itibariyla mevcut oldugunu ve `--with-http_v3_module` ile etkinlestirildigini belirtiyor.
- Nginx tarafinda `listen ... quic reuseport;` ve `Alt-Svc: h3=\":443\"` benzeri header yayini gerekiyor.
- Next.js resmi self-hosting dokumani, uygulamayi reverse proxy arkasinda calistirmayi oneriyor; HTTP versiyonu yonetimi tipik olarak proxy katmaninda cozuluyor.

## PaketJet Icin Karar

- Uygulanabilir, ancak uygulama noktasi `frontend` degil `nginx/` ve deployment pipeline.
- Bu repo turunde dogru sira:
  1. Production Nginx versiyonunun HTTP/3 destekleyip desteklemedigini dogrula.
  2. TLS stack'in QUIC uyumunu dogrula.
  3. Staging ortaminda `Alt-Svc` ve browser/network dogrulamasi yap.
  4. Ancak ondan sonra production rollout planla.

## Kaynaklar

- Nginx: https://nginx.org/en/docs/quic.html
- Next.js self-hosting: https://nextjs.org/docs/pages/guides/self-hosting
