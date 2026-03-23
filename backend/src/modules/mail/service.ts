// src/modules/mail/service.ts
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import {
  SITE_NAME,
  buildBookingRouteLabel,
  buildCarrierPaymentSubject,
  buildMailFromAddress,
  buildMailTransportSignature,
  createMailTransportConfig,
  escapeMailHtml,
  formatMailPrice,
  passwordChangedSchema,
  sendMailWithTransport,
  welcomeMailSchema,
  wrapMailBody,
} from "./helpers";
import type {
  PasswordChangedMailInput,
  WelcomeMailInput,
} from "./helpers";
import {
  sendMailSchema,
  type SendMailInput,
  type BookingMailInput,
  type WalletMailInput,
} from "./validation";
import {
  getSmtpSettings,
} from "@/modules/siteSettings";

// ── Transporter cache ──────────────────────────────────────────────────────
let cachedTransporter: Transporter | null = null;
let cachedSignature: string | null = null;

async function getTransporter(): Promise<Transporter> {
  const cfg = await getSmtpSettings();
  if (!cfg.host) throw new Error("smtp_host_not_configured");
  if (!cfg.port) cfg.port = cfg.secure ? 465 : 587;
  const resolvedCfg = { ...cfg, host: cfg.host, port: cfg.port };

  const signature = buildMailTransportSignature(cfg);
  if (cachedTransporter && cachedSignature === signature) return cachedTransporter;
  const transporter = nodemailer.createTransport(createMailTransportConfig(resolvedCfg));
  cachedTransporter = transporter;
  cachedSignature = signature;
  return transporter;
}

// ── Low-level sender ───────────────────────────────────────────────────────
export async function sendMailRaw(input: SendMailInput) {
  const data = sendMailSchema.parse(input);
  const smtpCfg = await getSmtpSettings();
  const from = buildMailFromAddress(smtpCfg);
  const transporter = await getTransporter();
  return sendMailWithTransport(transporter, from, data);
}

export async function sendMail(input: SendMailInput) {
  return sendMailRaw(input);
}

// ── Welcome ────────────────────────────────────────────────────────────────
export async function sendWelcomeMail(input: WelcomeMailInput) {
  const d = welcomeMailSchema.parse(input);
  const subject = `${SITE_NAME}'e Hos Geldiniz!`;
  const html = wrapMailBody(`
    <h2 style="font-size:18px;">Merhaba ${escapeMailHtml(d.user_name)},</h2>
    <p>${SITE_NAME} ailesine hos geldiniz! Hesabiniz basariyla olusturuldu.</p>
    <p>E-posta: <strong>${escapeMailHtml(d.user_email)}</strong></p>
    <p>Artik ilan verebilir veya kargo gonderebilirsiniz.</p>
    <p>Iyi yolculuklar,<br/><strong>${SITE_NAME} Ekibi</strong></p>
  `);
  const text = `Merhaba ${d.user_name},\n\n${SITE_NAME}'e hos geldiniz! Hesabiniz olusturuldu.\nE-posta: ${d.user_email}\n\n${SITE_NAME} Ekibi`;
  return sendMailRaw({ to: d.to, subject, html, text });
}

// ── Password Changed ───────────────────────────────────────────────────────
export async function sendPasswordChangedMail(input: PasswordChangedMailInput) {
  const d = passwordChangedSchema.parse(input);
  const name = d.user_name ?? "Kullanicimiz";
  const subject = `Sifreniz Guncellendi — ${SITE_NAME}`;
  const html = wrapMailBody(`
    <h2 style="font-size:18px;">Sifreniz Guncellendi</h2>
    <p>Merhaba <strong>${escapeMailHtml(name)}</strong>,</p>
    <p>Hesap sifreniz basariyla degistirildi.</p>
    <p>Eger bu islemi siz yapmadiysiniz lutfen en kisa surede bizimle iletisime gecin.</p>
    <p>${SITE_NAME} Ekibi</p>
  `);
  const text = `Merhaba ${name},\n\nSifreniz degistirildi. Bu siz degilseniz bizimle iletisime gecin.\n\n${SITE_NAME} Ekibi`;
  return sendMailRaw({ to: d.to, subject, html, text });
}

// ── Booking Created (musteri) ──────────────────────────────────────────────
export async function sendBookingCreatedMail(input: BookingMailInput) {
  const d = input;
  const route = buildBookingRouteLabel(d);
  const subject = `Rezervasyonunuz Alindi — ${route}`;
  const html = wrapMailBody(`
    <h2 style="font-size:18px;">Rezervasyonunuz Alindi</h2>
    <p>Merhaba <strong>${escapeMailHtml(d.customer_name)}</strong>,</p>
    <p><strong>${route}</strong> guzergahi icin rezervasyonunuz olusturuldu.</p>
    <table style="border-collapse:collapse;margin:12px 0;">
      <tr><td style="padding:4px 12px 4px 0;color:#64748B;">Miktar:</td><td><strong>${escapeMailHtml(String(d.kg_amount))} kg</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#64748B;">Tutar:</td><td><strong>${formatMailPrice(d.total_price)}</strong></td></tr>
      ${d.departure_date ? `<tr><td style="padding:4px 12px 4px 0;color:#64748B;">Hareket:</td><td><strong>${escapeMailHtml(d.departure_date)}</strong></td></tr>` : ""}
    </table>
    <p>Tasiyici onayladiktan sonra size bildirim gonderecegiz.</p>
    <p>${SITE_NAME} Ekibi</p>
  `);
  const text = `Merhaba ${d.customer_name},\n\n${d.from_city} → ${d.to_city} rezervasyonunuz alindi.\nMiktar: ${d.kg_amount} kg\nTutar: ${formatMailPrice(d.total_price)}\n\n${SITE_NAME} Ekibi`;
  return sendMailRaw({ to: d.to, subject, html, text });
}

// ── Booking Confirmed (musteri) ────────────────────────────────────────────
export async function sendBookingConfirmedMail(input: BookingMailInput) {
  const d = input;
  const route = buildBookingRouteLabel(d);
  const subject = `Rezervasyonunuz Onaylandi — ${route}`;
  const html = wrapMailBody(`
    <h2 style="font-size:18px;color:#16A34A;">Rezervasyonunuz Onaylandi</h2>
    <p>Merhaba <strong>${escapeMailHtml(d.customer_name)}</strong>,</p>
    <p><strong>${route}</strong> guzergahindaki rezervasyonunuz tasiyici tarafindan onaylandi.</p>
    ${d.carrier_name ? `<p>Tasiyici: <strong>${escapeMailHtml(d.carrier_name)}</strong></p>` : ""}
    ${d.departure_date ? `<p>Hareket Tarihi: <strong>${escapeMailHtml(d.departure_date)}</strong></p>` : ""}
    <p>Kargonuzun durumunu panelinizden takip edebilirsiniz.</p>
    <p>${SITE_NAME} Ekibi</p>
  `);
  const text = `Merhaba ${d.customer_name},\n\n${d.from_city} → ${d.to_city} rezervasyonunuz onaylandi.\n\n${SITE_NAME} Ekibi`;
  return sendMailRaw({ to: d.to, subject, html, text });
}

// ── Booking In Transit (musteri) ───────────────────────────────────────────
export async function sendBookingInTransitMail(input: BookingMailInput) {
  const d = input;
  const route = buildBookingRouteLabel(d);
  const subject = `Kargonuz Yola Cikti — ${route}`;
  const html = wrapMailBody(`
    <h2 style="font-size:18px;color:#F59E0B;">Kargonuz Yola Cikti</h2>
    <p>Merhaba <strong>${escapeMailHtml(d.customer_name)}</strong>,</p>
    <p><strong>${route}</strong> guzergahindaki kargonuz yola cikti.</p>
    <p>Durumunu panelinizden takip edebilirsiniz.</p>
    <p>${SITE_NAME} Ekibi</p>
  `);
  const text = `Merhaba ${d.customer_name},\n\n${d.from_city} → ${d.to_city} kargonuz yola cikti.\n\n${SITE_NAME} Ekibi`;
  return sendMailRaw({ to: d.to, subject, html, text });
}

// ── Booking Delivered (musteri) ────────────────────────────────────────────
export async function sendBookingDeliveredMail(input: BookingMailInput) {
  const d = input;
  const route = buildBookingRouteLabel(d);
  const subject = `Kargonuz Teslim Edildi — ${route}`;
  const html = wrapMailBody(`
    <h2 style="font-size:18px;color:#16A34A;">Kargonuz Teslim Edildi</h2>
    <p>Merhaba <strong>${escapeMailHtml(d.customer_name)}</strong>,</p>
    <p><strong>${route}</strong> guzergahindaki kargonuz basariyla teslim edildi.</p>
    <p>Deneyiminizi degerlendirmeyi unutmayin!</p>
    <p>${SITE_NAME} Ekibi</p>
  `);
  const text = `Merhaba ${d.customer_name},\n\n${d.from_city} → ${d.to_city} kargonuz teslim edildi.\n\n${SITE_NAME} Ekibi`;
  return sendMailRaw({ to: d.to, subject, html, text });
}

// ── Booking Cancelled (musteri) ────────────────────────────────────────────
export async function sendBookingCancelledMail(input: BookingMailInput & { refunded?: boolean }) {
  const d = input;
  const route = buildBookingRouteLabel(d);
  const subject = `Rezervasyonunuz Iptal Edildi — ${route}`;
  const refundLine = d.refunded
    ? `<p style="color:#16A34A;"><strong>${formatMailPrice(d.total_price)}</strong> tutarindaki odemeniz cuzdaniniza iade edildi.</p>`
    : "";
  const html = wrapMailBody(`
    <h2 style="font-size:18px;color:#EF4444;">Rezervasyonunuz Iptal Edildi</h2>
    <p>Merhaba <strong>${escapeMailHtml(d.customer_name)}</strong>,</p>
    <p><strong>${route}</strong> guzergahindaki rezervasyonunuz iptal edildi.</p>
    ${refundLine}
    <p>${SITE_NAME} Ekibi</p>
  `);
  const text = `Merhaba ${d.customer_name},\n\n${d.from_city} → ${d.to_city} rezervasyonunuz iptal edildi.${d.refunded ? ` ${formatMailPrice(d.total_price)} iade edildi.` : ""}\n\n${SITE_NAME} Ekibi`;
  return sendMailRaw({ to: d.to, subject, html, text });
}

// ── Carrier Payment (tasiyici) ─────────────────────────────────────────────
export async function sendCarrierPaymentMail(input: WalletMailInput) {
  const d = input;
  const subject = buildCarrierPaymentSubject(d);
  const html = wrapMailBody(`
    <h2 style="font-size:18px;color:#16A34A;">Odemeniz Aktarildi</h2>
    <p>Merhaba <strong>${escapeMailHtml(d.user_name)}</strong>,</p>
    <p>Teslim edilen kargo icin <strong>${formatMailPrice(d.amount)}</strong> cuzdaniniza aktarildi.</p>
    <p>Yeni bakiyeniz: <strong>${formatMailPrice(d.new_balance)}</strong></p>
    <p>${SITE_NAME} Ekibi</p>
  `);
  const text = `Merhaba ${d.user_name},\n\n${formatMailPrice(d.amount)} cuzdaniniza aktarildi.\nYeni bakiye: ${formatMailPrice(d.new_balance)}\n\n${SITE_NAME} Ekibi`;
  return sendMailRaw({ to: d.to, subject, html, text });
}

// ── Wallet Deposit (musteri/tasiyici) ──────────────────────────────────────
export async function sendDepositSuccessMail(input: WalletMailInput) {
  const d = input;
  const subject = `Bakiye Yukleme Onaylandi — ${SITE_NAME}`;
  const html = wrapMailBody(`
    <h2 style="font-size:18px;">Bakiye Yukleme Basarili</h2>
    <p>Merhaba <strong>${escapeMailHtml(d.user_name)}</strong>,</p>
    <p>Yuklenen tutar: <strong>${formatMailPrice(d.amount)}</strong></p>
    <p>Yeni bakiyeniz: <strong>${formatMailPrice(d.new_balance)}</strong></p>
    <p>${SITE_NAME} Ekibi</p>
  `);
  const text = `Merhaba ${d.user_name},\n\n${formatMailPrice(d.amount)} cuzdaniniza yuklendi.\nYeni bakiye: ${formatMailPrice(d.new_balance)}\n\n${SITE_NAME} Ekibi`;
  return sendMailRaw({ to: d.to, subject, html, text });
}
