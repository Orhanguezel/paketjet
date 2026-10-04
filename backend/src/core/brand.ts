// Gorunen marka metinleri tek yerden: ad APP_NAME ortam degiskeninden gelir.
// Ad tanimli degilse notr ifade kullanilir; baska bir firmanin adi asla gorunmez.
import { env } from "./env";

export const APP_NAME = env.APP_NAME;
/** Cumle icinde marka yerine gecen ad ("X'e hos geldiniz"). */
export const BRAND_LABEL = APP_NAME || "Destek";
export const TEAM_SIGNATURE = APP_NAME ? `${APP_NAME} Ekibi` : "Destek Ekibi";
export const MEMBER_LABEL = APP_NAME ? `${APP_NAME} üyesi` : "Üye";
/** "Konu — Marka"; marka yoksa yalniz konu. */
export const withBrand = (text: string, sep = " — ") => (APP_NAME ? `${text}${sep}${APP_NAME}` : text);
