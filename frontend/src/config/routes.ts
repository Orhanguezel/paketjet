/**
 * PaketJet — Uygulama Route Sabitları
 * Magic string yok — tüm yollar buradan.
 */

export const ROUTES = {
  home: "/",

  auth: {
    login:    "/giris",
    register: "/uye-ol",
    forgot:         "/sifremi-unuttum",
    forgotPassword: "/sifremi-unuttum",
    resetPassword:  "/sifre-sifirla",
  },

  ilanlar: {
    list:   "/ilanlar",
    detail: (id: string) => `/ilanlar/${id}`,
    yeni:   "/ilanlar/yeni",
  },

  takip: "/takip",

  panel: {
    root:          "/panel",
    musteri:       "/panel/musteri",
    odemeSonuc:    "/panel/ilan-alma-hakki/odeme-sonuc",
    tasiyici:      "/panel/tasiyici",
    ilanlarim:     "/panel/ilanlarim",
    satinAldiklarim: "/panel/satin-aldiklarim",
    ilanAlmaHakki: "/panel/ilan-alma-hakki",
    cuzdan:        "/panel/ilan-alma-hakki",
    bildirimler:   "/panel/bildirimler",
    profil:        "/panel/profil",

  },

  ilanVer: "/ilan-ver",

  dashboard: {
    root:      "/dashboard",
    ilanlarim: "/dashboard/ilanlarim",
    siparisler: "/dashboard/siparisler",
    profil:    "/dashboard/profil",
    mesajlar:  "/dashboard/mesajlar",
  },

  static: {
    hakkinda: "/hakkimizda",
    iletisim: "/iletisim",
    destek: "/destek",
    gizlilik: "/gizlilik-politikasi",
    kvkk: "/kvkk",
    kullanim: "/kullanim-kosullari",
    tasimaKurallari: "/tasima-kurallari",
    blog: "/blog",
    rota: (slug: string) => `/rota/${slug}`,
  },
} as const;
