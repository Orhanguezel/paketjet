import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "../Header";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useNotificationStore } from "@/modules/notification/notification.store";

vi.mock("@/modules/auth/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@/modules/notification/notification.store", () => ({
  useNotificationStore: vi.fn(),
}));

vi.mock("@/modules/auth/auth.service", () => ({
  logout: vi.fn(),
}));

vi.mock("@/components/ui/ThemeToggle", () => ({
  ThemeToggle: () => <button type="button">Tema</button>,
}));

describe("Header", () => {
  beforeEach(() => {
    vi.mocked(useNotificationStore).mockReturnValue({
      unreadCount: 0,
      fetchUnreadCount: vi.fn(),
      reset: vi.fn(),
    });
  });

  it('auth olmadan "Giris Yap" ve "Uye Ol" gorunur', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(<Header />);

    expect(screen.getByRole("link", { name: /giriş yap/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /üye ol/i })).toBeInTheDocument();
  });

  it('auth ile "Panel" ve "Cikis" gorunur', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      logout: vi.fn(),
    });

    render(<Header />);

    expect(screen.getByRole("link", { name: /panel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /çıkış/i })).toBeInTheDocument();
  });
});
