import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TasiyiciPage from "@/app/panel/tasiyici/page";
import {
  cancelBooking,
  confirmBooking,
  getCarrierBookings,
  updateBookingStatus,
} from "../booking.service";
import { getCarrierDashboard } from "@/modules/dashboard/dashboard.service";
import { deleteIlan, getMyIlans, updateIlanStatus } from "@/modules/ilan/ilan.service";

vi.mock("../booking.service", () => ({
  getCarrierBookings: vi.fn(),
  confirmBooking: vi.fn(),
  cancelBooking: vi.fn(),
  updateBookingStatus: vi.fn(),
}));

vi.mock("@/modules/dashboard/dashboard.service", () => ({
  getCarrierDashboard: vi.fn(),
}));

vi.mock("@/modules/ilan/ilan.service", () => ({
  getMyIlans: vi.fn(),
  updateIlanStatus: vi.fn(),
  deleteIlan: vi.fn(),
}));

describe("booking page", () => {
  beforeEach(() => {
    vi.mocked(getCarrierDashboard).mockResolvedValue({
      active_ilanlar: 2,
      total_bookings: 4,
      pending_bookings: 1,
      balance: "250.00",
      total_earnings: "300.00",
    });
    vi.mocked(getMyIlans).mockResolvedValue([]);
    vi.mocked(updateIlanStatus).mockResolvedValue({} as never);
    vi.mocked(deleteIlan).mockResolvedValue(undefined as never);
    vi.mocked(confirmBooking).mockResolvedValue({} as never);
    vi.mocked(cancelBooking).mockResolvedValue({ ok: true } as never);
    vi.mocked(updateBookingStatus).mockResolvedValue({} as never);
  });

  it("pending booking icin warning badge ve dogru butonlari gosterir", async () => {
    vi.mocked(getCarrierBookings).mockResolvedValue({
      data: [
        {
          id: "booking-1",
          ilan_id: "ilan-1",
          customer_id: "customer-1",
          carrier_id: "carrier-1",
          kg_amount: "12",
          total_price: "480",
          currency: "TRY",
          status: "pending",
          payment_status: "paid",
          created_at: "2026-03-21T10:00:00.000Z",
          updated_at: "2026-03-21T10:00:00.000Z",
          from_city: "Istanbul",
          to_city: "Izmir",
          customer_name: "Musteri",
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
    });

    render(<TasiyiciPage />);

    const badge = await screen.findByText("Bekliyor");
    expect(badge).toHaveClass("text-warning");
    expect(screen.getByRole("button", { name: "Onayla" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reddet" })).toBeInTheDocument();
  });

  it("confirmed booking icin dogru aksiyonlari gosterir", async () => {
    vi.mocked(getCarrierBookings).mockResolvedValue({
      data: [
        {
          id: "booking-2",
          ilan_id: "ilan-2",
          customer_id: "customer-1",
          carrier_id: "carrier-1",
          kg_amount: "8",
          total_price: "320",
          currency: "TRY",
          status: "confirmed",
          payment_status: "paid",
          created_at: "2026-03-21T10:00:00.000Z",
          updated_at: "2026-03-21T10:00:00.000Z",
          from_city: "Ankara",
          to_city: "Bursa",
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
    });

    render(<TasiyiciPage />);

    await waitFor(() => {
      expect(screen.getByText("Onaylandı")).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Yola Çıktı" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "İptal" })).toBeInTheDocument();
  });
});
