import { create } from "zustand";
import { getUnreadCount } from "./notification.service";

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (n: number) => void;
  fetchUnreadCount: () => Promise<void>;
  decrement: () => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (n) => set({ unreadCount: n }),
  fetchUnreadCount: async () => {
    try {
      const res = await getUnreadCount();
      set({ unreadCount: res.count });
    } catch {
      // sessiz hata — giriş yapılmamış olabilir
    }
  },
  decrement: () => set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),
  reset: () => set({ unreadCount: 0 }),
}));
