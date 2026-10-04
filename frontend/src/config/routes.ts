/**
 * PaketJet — Uygulama Route Sabitları
 * Magic string yok — tüm yollar buradan.
 */

export const ROUTES = {
  home: "/",
  shareImage: "/opengraph-image",
  internal: {uiPreview:"/ui-preview"},

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
    editIlan: (id: string) => `/panel/tasiyici/ilanlar/${encodeURIComponent(id)}/duzenle`,
    satinAldiklarim: "/panel/satin-aldiklarim",
    ilanAlmaHakki: "/panel/ilan-alma-hakki",
    cuzdan:        "/panel/ilan-alma-hakki",
    bildirimler:   "/panel/bildirimler",
    profil:        "/panel/profil",
    degerlendirmelerim: '/panel/degerlendirmelerim',
    gelistirici:   "/panel/gelistirici",

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
    mesafeliSatis: "/mesafeli-satis-sozlesmesi",
    iptalIade: "/iptal-ve-iade-kosullari",
    gelistiriciler: "/gelistiriciler",
    blog: "/blog",
    rota: (slug: string) => `/rota/${slug}`,
    uye: (id: string) => `/uyeler/${encodeURIComponent(id)}`,
  },
} as const;
