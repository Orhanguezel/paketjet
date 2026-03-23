export interface SupportFaq {
  id: string;
  category: "genel" | "kargo" | "odeme" | "hesap" | "teknik";
  display_order: number;
  is_published: number;
  locale: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: "genel" | "kargo" | "odeme" | "hesap" | "teknik";
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  admin_note?: string | null;
  ip?: string | null;
  user_agent?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportTicketCreateInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: SupportTicket["category"];
}

export interface SupportFaqListParams {
  locale?: string;
  category?: SupportFaq["category"];
  is_published?: boolean;
  limit?: number;
  offset?: number;
}

export interface SupportTicketListParams {
  status?: SupportTicket["status"];
  category?: SupportTicket["category"];
  priority?: SupportTicket["priority"];
  search?: string;
  limit?: number;
  offset?: number;
}
