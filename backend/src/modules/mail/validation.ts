// src/modules/mail/validation.ts
import { z } from "zod";

export const sendMailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(255),
  text: z.string().optional(),
  html: z.string().optional(),
});

export type SendMailInput = z.infer<typeof sendMailSchema>;

/** Booking olusturma / durum degisikligi mailleri icin ortak payload */
export const bookingMailSchema = z.object({
  to: z.string().email(),
  customer_name: z.string().min(1),
  carrier_name: z.string().min(1).optional(),
  from_city: z.string().min(1),
  to_city: z.string().min(1),
  kg_amount: z.union([z.string(), z.number()]),
  total_price: z.union([z.string(), z.number()]),
  departure_date: z.string().optional(),
  booking_id: z.string().optional(),
});

export type BookingMailInput = z.infer<typeof bookingMailSchema>;

/** Cuzdan islem mailleri */
export const walletMailSchema = z.object({
  to: z.string().email(),
  user_name: z.string(),
  amount: z.union([z.string(), z.number()]),
  new_balance: z.union([z.string(), z.number()]),
});

export type WalletMailInput = z.infer<typeof walletMailSchema>;
