import { apiGet, apiPatch, apiPost } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { NotificationListResponse, UnreadCountResponse } from "./notification.type";

export const getNotifications = (page = 1) =>
  apiGet<NotificationListResponse>(`${API.notifications.list}?page=${page}&limit=20`);

export const getUnreadCount = () =>
  apiGet<UnreadCountResponse>(API.notifications.unreadCount);

export const markRead = (id: string) =>
  apiPatch(API.notifications.markRead(id), {});

export const markAllRead = () =>
  apiPost(API.notifications.markAllRead, {});
