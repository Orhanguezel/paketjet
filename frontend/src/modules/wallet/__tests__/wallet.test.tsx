import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CuzdanPage from "@/app/panel/cuzdan/page";
import { getTransactions, getWallet, initiateDeposit } from "../wallet.service";

vi.mock("../wallet.service", () => ({
  getWallet: vi.fn(),
  getTransactions: vi.fn(),
  initiateDeposit: vi.fn(),
}));

describe("wallet page", () => {
  beforeEach(() => {
    vi.mocked(getWallet).mockResolvedValue({
      id: "wallet-1",
      user_id: "user-1",
      balance: "1250.00",
      total_earnings: "450.00",
      currency: "TRY",
      updated_at: "2026-03-21T10:00:00.000Z",
    });
    vi.mocked(getTransactions).mockResolvedValue({
      data: [
        {
          id: "tx-1",
          wallet_id: "wallet-1",
          type: "carrier_credit",
          amount: "320.00",
          description: "Teslimat kazanci",
          created_at: "2026-03-21T10:00:00.000Z",
        },
        {
          id: "tx-2",
          wallet_id: "wallet-1",
          type: "refund",
          amount: "80.00",
          description: "Iade",
          created_at: "2026-03-20T10:00:00.000Z",
        },
      ],
      total: 2,
      page: 1,
    });
    vi.mocked(initiateDeposit).mockResolvedValue({
      checkoutFormContent: "<div>iyzico</div>",
      token: "token-1",
      conversationId: "conv-1",
      amount: 100,
      successUrl: "/success",
      failUrl: "/fail",
    });
  });

  it("bakiyeyi dogru gosterir", async () => {
    render(<CuzdanPage />);

    await waitFor(() => {
      expect(screen.getByText("₺1250.00")).toBeInTheDocument();
    });
    expect(screen.getByText(/toplam kazanç: ₺450.00/i)).toBeInTheDocument();
  });

  it("transaction listesini renderlar", async () => {
    render(<CuzdanPage />);

    await waitFor(() => {
      expect(screen.getByText(/teslimat kazanci/i)).toBeInTheDocument();
    });
    expect(screen.getAllByText(/kazanç|iade/i)).toHaveLength(4);
  });
});
