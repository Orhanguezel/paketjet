# PaketJet

PaketJet, portfolio metadata'sinda lojistik ve kargo operasyon platformu olarak tanimlanmis bir projedir. Ancak mevcut checkout'ta uygulama kaynak kodu yerine dokuman odakli bir klasor yapisi gorunmektedir.

## Canli Erisim Notu

Canli server `vps-paketjet` SSH kisa yolundadir. Key ile sifresiz erisim: `ssh vps-paketjet`.

## Mevcut Workspace Durumu

- `doku/`: dokumantasyon dosyalari
- `sozlesme/`: sozlesme veya is dokumanlari

Bu checkout'ta `package.json`, backend/frontend uygulama klasoru veya calistirma script'i bulunmamaktadir.

## Portfolio Metadata Ozeti

`project.portfolio.json` su kapsam bilgilerini tasir:

- kategori: Logistics Platform
- hedef moduller: shipment tracking, customer portal, operations dashboard
- hedef stack: Next.js, React, Fastify, MySQL, Drizzle ORM, Bun, Zod

Bu bilgiler portfolio metadata kaynagindan gelir; mevcut checkout'ta kaynak kodu teyit edilmemistir.

## Dokumantasyon Kurali

Kaynak kod bu klasore eklendiginde README, gercek klasor yapisi ve komutlarla yeniden guncellenmelidir. Metadata degisirse once `project.portfolio.json` guncellenir.
