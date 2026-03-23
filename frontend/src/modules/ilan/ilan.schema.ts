import { z } from "zod";

export const ilanSearchSchema = z.object({
  nereden:  z.string().min(2, "En az 2 karakter giriniz"),
  nereye:   z.string().min(2, "En az 2 karakter giriniz"),
  tarih:    z.string().optional(),
  kg_aralik: z
    .enum(["1-5", "5-10", "10-20", "20-50", "50+"])
    .optional(),
});

export const ilanCreateSchema = z.object({
  nereden:  z.string().min(2, "Nereden şehir giriniz"),
  nereye:   z.string().min(2, "Nereye şehir giriniz"),
  tarih:    z.string().min(1, "Tarih seçiniz"),
  saat:     z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Saat formatı: SS:DD"),
  kg_min:   z.number().min(0).max(10000),
  kg_max:   z.number().min(0).max(10000),
  boyut_cm: z.number().min(1).max(999),
  fiyat:    z.number().min(0).optional(),
  aciklama: z.string().max(500).optional(),
});

export const ilanTakipSchema = z.object({
  takip_kodu: z
    .string()
    .min(6, "Takip kodu en az 6 karakter")
    .max(20, "Takip kodu en fazla 20 karakter")
    .toUpperCase(),
});

export type IlanSearchForm  = z.infer<typeof ilanSearchSchema>;
export type IlanCreateForm  = z.infer<typeof ilanCreateSchema>;
export type IlanTakipForm   = z.infer<typeof ilanTakipSchema>;
