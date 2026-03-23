import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IlanCard from "@/components/IlanCard";
import type { Ilan } from "../ilan.type";

const ilan: Ilan = {
  id: "ilan-1",
  user_id: "user-1",
  from_city: 'Istanbul',
  to_city: 'Ankara',
  departure_date: '2026-03-21T10:30:00.000Z',
  total_capacity_kg: '120',
  available_capacity_kg: '48',
  price_per_kg: '35',
  currency: 'TRY',
  is_negotiable: 0,
  vehicle_type: 'van',
  contact_phone: '+905551112233',
  status: 'active',
  carrier_name: 'PaketJet Tasiyici',
  created_at: '2026-03-20T10:00:00.000Z',
  updated_at: '2026-03-20T10:00:00.000Z',
};

describe("IlanCard", () => {
  it("ilan bilgilerini dogru render eder", () => {
    render(<IlanCard ilan={ilan} />);

    expect(screen.getByText(/istanbul/i)).toBeInTheDocument();
    expect(screen.getByText(/ankara/i)).toBeInTheDocument();
    expect(screen.getByText(/48 kg müsait/i)).toBeInTheDocument();
    expect(screen.getByText(/35 ₺\/kg/i)).toBeInTheDocument();
  });

  it('"Detay" linki yerine kart linki dogru URL\'ye gider', () => {
    render(<IlanCard ilan={ilan} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/ilanlar/ilan-1");
  });
});
