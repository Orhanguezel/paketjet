import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api-client";

const A = (path: string) => `/api/admin${path}`;

// Dashboard
export const getAdminSummary = () => apiGet<AdminSummary>(A("/dashboard/summary"));
export const getRevenueStats = () => apiGet<RevenueStats>(A("/dashboard/stats/revenue"));
export const getActivityStats = () => apiGet<ActivityStats>(A("/dashboard/stats/activity"));

// İlanlar
export const adminListIlanlar = (p: AdminListParams = {}) =>
  apiGet<AdminListResponse>(A(`/ilanlar?${toQS(p)}`));
export const adminUpdateIlanStatus = (id: string, status: string) =>
  apiPatch(A(`/ilanlar/${id}/status`), { status });
export const adminDeleteIlan = (id: string) =>
  apiDelete(A(`/ilanlar/${id}`));

// Bookings
export const adminListBookings = (p: AdminListParams = {}) =>
  apiGet<AdminListResponse>(A(`/bookings?${toQS(p)}`));
export const adminUpdateBookingStatus = (id: string, status: string) =>
  apiPatch(A(`/bookings/${id}/status`), { status });
export const adminConfirmTransferPayment = (id: string) =>
  apiPatch(A(`/bookings/${id}/confirm-payment`), {});

// Commission
export interface CommissionConfig { rate: number; type: string; }
export const adminGetCommissionRate = () => apiGet<CommissionConfig>(A("/bookings/commission"));
export const adminSetCommissionRate = (rate: number, type = "percentage") =>
  apiPut(A("/bookings/commission"), { rate, type });

// Carriers
export const adminListCarriers = (p: AdminListParams = {}) =>
  apiGet<AdminListResponse>(A(`/carriers?${toQS(p)}`));

// Users
export const adminListUsers = (p: AdminListParams = {}) =>
  apiGet<AdminUser[]>(A(`/users?${toQS(p)}`));
export const adminSetUserActive = (id: string, is_active: boolean) =>
  apiPost(A(`/users/${id}/active`), { is_active });

// ── Types ──────────────────────────────────────────────────────────────────

export interface AdminSummary {
  users: number;
  active_ilanlar: number;
  total_bookings: number;
  total_earnings: number;
  booking_stats: { pending: number; confirmed: number; in_transit: number; delivered: number; cancelled: number };
}

export interface RevenueStats {
  monthly: { month: string; bookings: number; revenue: string }[];
  top_carriers: { carrier_id: string; carrier_name: string | null; carrier_email: string | null; total_revenue: string; total_bookings: number }[];
}

export interface ActivityStats {
  last_7_days: { new_users: number; new_ilanlar: number; new_bookings: number };
  daily: { users: unknown[]; ilanlar: unknown[]; bookings: unknown[] };
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: number;
  created_at: string;
  role: string;
  wallet_balance: number;
}

export interface AdminListResponse {
  data: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminListParams {
  page?: number;
  limit?: number;
  status?: string;
  [key: string]: string | number | undefined;
}

// SEO
export interface SeoPageData {
  pageKey: string;
  title?: string;
  description?: string;
  keywords?: string;
  open_graph?: { type?: string; images?: string[] };
  twitter?: { card?: string; site?: string; creator?: string };
  robots?: { noindex?: boolean; index?: boolean; follow?: boolean };
}

export const adminListAllSeo = () =>
  apiGet<SeoPageData[]>("/api/site_settings/seo");

export const adminGetPageSeo = (pageKey: string) =>
  apiGet<SeoPageData>(`/api/site_settings/seo/${pageKey}`);

export const adminSavePageSeo = (pageKey: string, value: Omit<SeoPageData, "pageKey">) =>
  apiPost(A("/site-settings/bulk-upsert"), {
    items: [{ key: `seo_pages_${pageKey}`, value, locale: "tr" }],
  });

// Global SEO
export interface GlobalSeoData {
  site_name?: string;
  title_template?: string;
  default_description?: string;
  default_keywords?: string;
  og_image?: string;
  og_type?: string;
  twitter_card?: string;
  twitter_site?: string;
  author?: string;
}

export const adminGetGlobalSeo = async (): Promise<GlobalSeoData | null> => {
  try {
    const seo = await apiGet<{ value?: Record<string, unknown> }>(A("/site-settings/site_seo?locale=tr"));
    const meta = await apiGet<{ value?: Record<string, unknown> }>(A("/site-settings/site_meta_default?locale=tr"));
    const s = seo?.value ?? {};
    const m = meta?.value ?? {};
    const og = (s.open_graph ?? {}) as Record<string, unknown>;
    const tw = (s.twitter ?? {}) as Record<string, unknown>;
    return {
      site_name: (s.site_name as string) ?? "",
      title_template: (s.title_template as string) ?? "",
      default_description: (m.description as string) ?? (s.description as string) ?? "",
      default_keywords: (m.keywords as string) ?? "",
      og_image: ((og.images as string[]) ?? [])[0] ?? "",
      og_type: (og.type as string) ?? "website",
      twitter_card: (tw.card as string) ?? "summary_large_image",
      twitter_site: (tw.site as string) ?? "",
      author: (s.author as string) ?? "",
    };
  } catch {
    return null;
  }
};

export const adminSaveGlobalSeo = (data: GlobalSeoData) =>
  apiPost(A("/site-settings/bulk-upsert"), {
    items: [
      {
        key: "site_seo",
        locale: "tr",
        value: {
          site_name: data.site_name || "PaketJet",
          title_default: data.site_name || "PaketJet",
          title_template: data.title_template || "%s | PaketJet",
          description: data.default_description || "",
          author: data.author || "",
          open_graph: {
            type: data.og_type || "website",
            images: data.og_image ? [data.og_image] : [],
          },
          twitter: {
            card: data.twitter_card || "summary_large_image",
            site: data.twitter_site || "",
            creator: data.twitter_site || "",
          },
          robots: { index: true, follow: true, noindex: false },
        },
      },
      {
        key: "site_meta_default",
        locale: "tr",
        value: {
          title: data.site_name || "PaketJet",
          description: data.default_description || "",
          keywords: data.default_keywords || "",
        },
      },
    ],
  });

// Contacts
export interface ContactMessage { id: string; name: string; email: string; phone?: string; subject?: string; message: string; is_read?: number; created_at: string; }
export const adminListContacts = (p: AdminListParams = {}) => apiGet<ContactMessage[]>(A(`/contacts?${toQS(p)}`));
export const adminGetContact = (id: string) => apiGet<ContactMessage>(A(`/contacts/${id}`));
export const adminMarkContactRead = (id: string) => apiPatch(A(`/contacts/${id}`), { is_read: 1 });
export const adminDeleteContact = (id: string) => apiDelete(A(`/contacts/${id}`));

// Custom Pages
export interface AdminCustomPage {
  id: string;
  module_key: string;
  is_published: number;
  display_order: number;
  featured_image?: string | null;
  storage_asset_id?: string | null;
  locale: string;
  title: string;
  slug: string;
  content?: string | null;
  summary?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
}
export const adminListCustomPages = (p: AdminListParams = {}) => apiGet<AdminCustomPage[]>(A(`/custom-pages?${toQS(p)}`));
export const adminGetCustomPage = (id: string, locale = "tr") => apiGet<AdminCustomPage>(A(`/custom-pages/${id}?locale=${locale}`));
export const adminCreateCustomPage = (data: Partial<AdminCustomPage> & { locale: string; title: string; slug: string }) =>
  apiPost<AdminCustomPage>(A("/custom-pages"), data);
export const adminUpdateCustomPage = (id: string, data: Partial<AdminCustomPage> & { locale: string }) =>
  apiPatch<AdminCustomPage>(A(`/custom-pages/${id}`), data);
export const adminDeleteCustomPage = (id: string) => apiDelete(A(`/custom-pages/${id}`));
export const adminReorderCustomPages = (items: { id: string; display_order: number }[]) =>
  apiPost(A("/custom-pages/reorder"), { items });

// Support FAQs
export interface AdminFaq {
  id: string;
  category: string;
  display_order: number;
  is_published: number;
  locale: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}
export const adminListFaqs = (p: AdminListParams = {}) => apiGet<AdminFaq[]>(A(`/support/faqs?${toQS(p)}`));
export const adminCreateFaq = (data: Partial<AdminFaq> & { locale: string; question: string; answer: string }) =>
  apiPost<AdminFaq>(A("/support/faqs"), data);
export const adminUpdateFaq = (id: string, data: Partial<AdminFaq> & { locale: string }) =>
  apiPatch<AdminFaq>(A(`/support/faqs/${id}`), data);
export const adminDeleteFaq = (id: string) => apiDelete(A(`/support/faqs/${id}`));
export const adminReorderFaqs = (items: { id: string; display_order: number }[]) =>
  apiPost(A("/support/faqs/reorder"), { items });

// Support Tickets
export interface AdminSupportTicket {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  admin_note?: string | null;
  created_at: string;
  updated_at: string;
}
export const adminListTickets = (p: AdminListParams = {}) => apiGet<AdminSupportTicket[]>(A(`/support/tickets?${toQS(p)}`));
export const adminGetTicket = (id: string) => apiGet<AdminSupportTicket>(A(`/support/tickets/${id}`));
export const adminUpdateTicket = (id: string, data: Partial<AdminSupportTicket>) =>
  apiPatch<AdminSupportTicket>(A(`/support/tickets/${id}`), data);
export const adminDeleteTicket = (id: string) => apiDelete(A(`/support/tickets/${id}`));

// Wallet & Withdrawals
export interface AdminWallet { id: string; user_id: string; balance: string; total_earnings: string; user_email?: string; user_name?: string; }
export interface WalletTransaction { id: string; wallet_id: string; user_id: string; type: string; amount: string; purpose: string; description: string; payment_status: string; created_at: string; }
export const adminListWallets = (p: AdminListParams = {}) => apiGet<AdminWallet[]>(A(`/wallets?${toQS(p)}`));
export const adminAdjustWallet = (userId: string, amount: number, description: string) => apiPost(A("/wallets/adjust"), { user_id: userId, amount, description });
export const adminListWalletTx = (walletId: string, p: AdminListParams = {}) => apiGet<WalletTransaction[]>(A(`/wallets/${walletId}/transactions?${toQS(p)}`));



// Email Templates
export interface EmailTemplate { id: string; slug: string; subject: string; body_html: string; locale: string; created_at: string; }
export const adminListEmailTemplates = () => apiGet<EmailTemplate[]>(A("/email_templates"));
export const adminGetEmailTemplate = (id: string) => apiGet<EmailTemplate>(A(`/email_templates/${id}`));
export const adminUpdateEmailTemplate = (id: string, data: Partial<EmailTemplate>) => apiPatch(A(`/email_templates/${id}`), data);

// Audit
export interface AuditLog { id: string; method: string; path: string; status_code: number; user_id?: string; ip?: string; duration_ms?: number; created_at: string; }
export interface AuthEvent { id: string; event_type: string; user_id?: string; ip?: string; user_agent?: string; created_at: string; }
export const adminListRequestLogs = (p: AdminListParams = {}) => apiGet<AuditLog[]>(A(`/audit/request-logs?${toQS(p)}`));
export const adminListAuthEvents = (p: AdminListParams = {}) => apiGet<AuthEvent[]>(A(`/audit/auth-events?${toQS(p)}`));

// Telegram
export interface TelegramInbound { id: string; chat_id: string; text: string; from_username?: string; created_at: string; }
export const adminListTelegramInbound = (p: AdminListParams = {}) => apiGet<TelegramInbound[]>(A(`/telegram/inbound?${toQS(p)}`));
export const adminGetAutoreply = () => apiGet<{ enabled: boolean; text: string }>(A("/telegram/autoreply"));
export const adminSetAutoreply = (data: { enabled: boolean; text: string }) => apiPost(A("/telegram/autoreply"), data);
export const adminSendTelegramTest = (text: string) => apiPost(A("/telegram/test"), { text });

// Reports
export interface KpiReport { total_users: number; total_ilanlar: number; total_bookings: number; total_revenue: string; avg_booking_value: string; }
export interface LocationReport { city: string; ilan_count: number; booking_count: number; }[]
export const adminGetKpi = () => apiGet<KpiReport>(A("/reports/kpi"));
export const adminGetLocations = () => apiGet<LocationReport[]>(A("/reports/locations"));

// Storage
export interface StorageAsset { id: string; filename: string; mimetype: string; size: number; url: string; created_at: string; }
export const adminListAssets = (p: AdminListParams = {}) => apiGet<StorageAsset[]>(A(`/storage/assets?${toQS(p)}`));
export const adminDeleteAsset = (id: string) => apiDelete(A(`/storage/assets/${id}`));

function toQS(p: AdminListParams): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) {
    if (v !== undefined && v !== "") params.set(k, String(v));
  }
  return params.toString();
}
