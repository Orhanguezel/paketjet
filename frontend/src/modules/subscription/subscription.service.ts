import { apiGet, apiPost } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { Plan, MySubscriptionResponse, SubscriptionHistoryItem } from "./subscription.type";

export function getPlans() {
  return apiGet<Plan[]>(API.subscription.plans);
}

export function getMySubscription() {
  return apiGet<MySubscriptionResponse>(API.subscription.my);
}

export function purchasePlan(planId: string) {
  return apiPost<{ id: string }>(API.subscription.purchase, { plan_id: planId });
}

export function cancelSubscription() {
  return apiPost<{ ok: boolean }>(API.subscription.cancel);
}

export function getSubscriptionHistory() {
  return apiGet<SubscriptionHistoryItem[]>(API.subscription.history);
}
