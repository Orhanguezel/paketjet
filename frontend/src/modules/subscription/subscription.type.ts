export interface Plan {
  id: string;
  name: string;
  slug: string;
  price: string;
  ilan_limit: number;
  duration_days: number;
  features: string[];
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface ActiveSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  starts_at: string;
  expires_at: string;
  status: string;
  payment_ref: string | null;
  created_at: string;
  plan_name: string;
  plan_slug: string;
  ilan_limit: number;
  plan_price: string;
  plan_features: string[];
}

export interface SubscriptionUsage {
  ilans_this_month: number;
  ilan_limit: number;
  remaining: number;
}

export interface MySubscriptionResponse {
  active: boolean;
  subscription: ActiveSubscription | null;
  usage: SubscriptionUsage | null;
  early_user: boolean;
  free_quota: number;
}

export interface SubscriptionHistoryItem {
  id: string;
  plan_id: string;
  starts_at: string;
  expires_at: string;
  status: string;
  created_at: string;
  plan_name: string;
  plan_slug: string;
}
