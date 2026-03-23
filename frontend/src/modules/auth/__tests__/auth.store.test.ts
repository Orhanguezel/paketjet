import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "../auth.store";

const TEST_USER = {
  id: "user-1",
  email: "test@paketjet.com",
  full_name: "Test User",
};

describe("auth.store", () => {
  beforeEach(() => {
    localStorage.clear();
    act(() => {
      useAuthStore.setState({ user: null, isAuthenticated: false });
    });
  });

  it("login sonrasi user set edilir", () => {
    act(() => {
      useAuthStore.getState().setUser(TEST_USER);
    });

    expect(useAuthStore.getState().user).toEqual(TEST_USER);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it("logout sonrasi state temizlenir", () => {
    act(() => {
      useAuthStore.getState().setUser(TEST_USER);
      useAuthStore.getState().logout();
    });

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("persist'ten geri yuklenir", async () => {
    localStorage.setItem(
      "paketjet-auth",
      JSON.stringify({
        state: { user: TEST_USER, isAuthenticated: true },
        version: 0,
      }),
    );

    await (useAuthStore as typeof useAuthStore & {
      persist: { rehydrate: () => Promise<void> | void };
    }).persist.rehydrate();

    expect(useAuthStore.getState().user).toEqual(TEST_USER);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
