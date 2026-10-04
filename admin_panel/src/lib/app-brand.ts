// Gorunen marka ve adresler dagitim ortamindan gelir; kodda marka/alan adi yazmaz.
// Ad tanimli degilse notr ifade kullanilir.
export const APP_NAME = (process.env.NEXT_PUBLIC_APP_NAME ?? '').trim();
/** Herkese acik site (uye girisi, ana sayfa). */
export const PUBLIC_SITE_URL = (process.env.NEXT_PUBLIC_PUBLIC_SITE_URL ?? '').trim().replace(/\/+$/, '');
/** Bu panelin kendi adresi. */
export const PANEL_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim().replace(/\/+$/, '');
export const PUBLIC_HOST = PUBLIC_SITE_URL.replace(/^https?:\/\//, '');
export const PANEL_TITLE = APP_NAME ? `${APP_NAME} Yönetim Paneli` : 'Yönetim Paneli';
