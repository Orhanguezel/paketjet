/**
 * PaketJet — API path sabitleri
 * api-client.ts NEXT_PUBLIC_API_URL'yi prefix olarak ekler,
 * bu dosya yalnızca path döner: "/api/..."
 */

export const API = {
  auth: {
    login:    "/api/auth/token",
    register: "/api/auth/signup",
    logout:   "/api/auth/logout",
    me:       "/api/auth/me",
    refresh:  "/api/auth/refresh",
    forgotPassword: "/api/auth/password-reset/request",
    resetPassword:  "/api/auth/password-reset/confirm",
  },

  ilanlar: {
    list:   "/api/ilanlar",
    my:     "/api/ilanlar/my",
    detail: (id: string) => `/api/ilanlar/${id}`,
    status: (id: string) => `/api/ilanlar/${id}/status`,
    photos: (id: string) => `/api/ilanlar/${id}/photos`,
  },

  bookings: {
    list:    "/api/bookings",
    my:      "/api/bookings/my",
    detail:  (id: string) => `/api/bookings/${id}`,
    confirm: (id: string) => `/api/bookings/${id}/confirm`,
    cancel:  (id: string) => `/api/bookings/${id}/cancel`,
    status:  (id: string) => `/api/bookings/${id}/status`,
    payInitiate: (id: string) => `/api/bookings/${id}/pay`,
    bankDetails: "/api/bookings/bank-details",
  },

  wallet: {
    get:             "/api/wallet",
    transactions:    "/api/wallet/transactions",
    depositInitiate: "/api/wallet/deposit/initiate",
  },

  notifications: {
    list:        "/api/notifications",
    unreadCount: "/api/notifications/unread-count",
    markAllRead: "/api/notifications/mark-all-read",
    markRead:    (id: string) => `/api/notifications/${id}`,
  },

  profiles: {
    me:     "/api/profiles/me",
    update: "/api/profiles/me",
  },

  dashboard: {
    carrier:  "/api/dashboard/carrier",
    customer: "/api/dashboard/customer",
  },

  ratings: {
    create:         "/api/ratings",
    byBooking:      (bookingId: string) => `/api/ratings/booking/${bookingId}`,
    byCarrier:      (carrierId: string) => `/api/ratings/carrier/${carrierId}`,
  },

  siteSettings: {
    list:       "/api/site_settings",
    byKey:      (key: string) => `/api/site_settings/${key}`,
    seoAll:     "/api/site_settings/seo",
    seoPage:    (pageKey: string) => `/api/site_settings/seo/${pageKey}`,
  },

  contacts: {
    create: "/api/contacts",
  },

  customPages: {
    list: "/api/custom-pages",
    detail: (id: string) => `/api/custom-pages/${id}`,
    bySlug: (slug: string) => `/api/custom-pages/by-slug/${slug}`,
  },

  carrierBank: {
    get:     "/api/carrier-bank",
    upsert:  "/api/carrier-bank",
    delete:  "/api/carrier-bank",
  },

  subscription: {
    plans:    "/api/subscription/plans",
    plan:     (id: string) => `/api/subscription/plans/${id}`,
    my:       "/api/subscription/my",
    purchase: "/api/subscription/purchase",
    cancel:   "/api/subscription/cancel",
    history:  "/api/subscription/history",
  },

  withdrawal: {
    create: "/api/withdrawal",
    my:     "/api/withdrawal/my",
  },

  admin: {
    withdrawals:        "/api/admin/withdrawals",
    processWithdrawal:  (id: string) => `/api/admin/withdrawals/${id}/process`,
  },

  support: {
    faqs: "/api/support/faqs",
    tickets: "/api/support/tickets",
    myTickets: "/api/support/tickets/my",
  },
} as const;

// Geriye dönük uyumluluk (eski API_ENDPOINTS adını kullanıyorsa)
export const API_ENDPOINTS = API;
