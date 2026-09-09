import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { initialListing, listingPayload, validateListingStep } from "../ilan-wizard";
import IlanVerForm from "../components/IlanVerForm";
import { createIlan, getOwnedIlan } from "../ilan.service";
import { useAuthStore } from "@/modules/auth/auth.store";
vi.mock("../ilan.service", () => ({ createIlan: vi.fn(), updateIlan: vi.fn(), getOwnedIlan: vi.fn() }));
vi.mock("@paketjet/locations", () => ({
  AddressAutocomplete: ({ label, value, onChange }: { label: string; value: string; onChange: (s: string) => void }) => (
    <label>
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  ),
}));
const start = "2099-10-12T14:30";
beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({ user: { id: "test", email: "test@example.com", full_name: "Deniz Test", phone: "05551234567", role: "customer" } });
});
function fillRoute() {
  fireEvent.change(screen.getByLabelText("Nereden"), { target: { value: "Küçükkuyu Köyü" } });
  fireEvent.change(screen.getByLabelText("Nereye"), { target: { value: "İzmir, Urla" } });
  fireEvent.change(screen.getByLabelText("Hareket tarihi ve saati"), { target: { value: start } });
}
function next() {
  fireEvent.click(screen.getByRole("button", { name: "Devam et" }));
}
it("validates route, future date, arrival order and private contact", () => {
  expect(validateListingStep(0, initialListing, start, "")).toMatch(/adres/);
  const form = { ...initialListing, from_city: "Köy", to_city: "Urla" };
  expect(validateListingStep(0, form, "2000-01-01T00:00", "")).toMatch(/gelecekte/);
  expect(validateListingStep(0, form, start, "2099-10-11T12:00")).toMatch(/önce/);
  expect(validateListingStep(2, { ...form, contact_name: "   " }, start, "")).toMatch(/soyad/);
  expect(validateListingStep(2, { ...form, contact_name: "Deniz", contact_phone: "123" }, start, "")).toMatch(/telefon/);
  expect(listingPayload({ ...form, contact_phone: "05551234567" }, start, "").arrival_date).toBeNull();
  expect(listingPayload({ ...form, contact_phone: "05551234567", contact_email: "" }, start, "").contact_email).toBeNull();
  expect(listingPayload({ ...form, contact_phone: "05551234567" }, start, "").departure_date).toBe("2099-10-12T11:30:00.000Z");
});
it("retains previous step values and submits only after review, with duplicate protection", async () => {
  let finish!: (value: unknown) => void;
  vi.mocked(createIlan).mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve as (v: unknown) => void;
      }),
  );
  render(<IlanVerForm />);
  next();
  expect(screen.getByRole("alert")).toHaveTextContent("adres");
  fillRoute();
  next();
  expect(screen.getByRole("heading", { name: "Aracını ve yolculuğunu anlat" })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("İlan başlığı (isteğe bağlı)"), { target: { value: "Köyden Urla’ya" } });
  fireEvent.click(screen.getByRole("button", { name: "Geri" }));
  expect(screen.getByLabelText("Nereden")).toHaveValue("Küçükkuyu Köyü");
  next();
  expect(screen.getByLabelText("İlan başlığı (isteğe bağlı)")).toHaveValue("Köyden Urla’ya");
  next();
  expect(screen.getByLabelText("Telefon")).toHaveValue("05551234567");
  next();
  expect(createIlan).not.toHaveBeenCalled();
  expect(screen.getByRole("heading", { name: "İlanına son bir kez göz at" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "İncelemeye gönder" }));
  fireEvent.submit(screen.getByRole("button", { name: "Gönderiliyor…" }).closest("form")!);
  expect(createIlan).toHaveBeenCalledTimes(1);
  finish({});
  await screen.findByRole("heading", { name: "İlanın incelemeye gönderildi" });
});
it("keeps review and data after an API failure so the user can retry", async () => {
  vi.mocked(createIlan).mockRejectedValue(new Error("offline"));
  render(<IlanVerForm />);
  fillRoute();
  next();
  next();
  next();
  fireEvent.click(screen.getByRole("button", { name: "İncelemeye gönder" }));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Bilgilerin korundu"));
  expect(screen.getByRole("heading", { name: "İlanına son bir kez göz at" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "İncelemeye gönder" })).toBeEnabled();
});
it("does not show a blank editable form when loading an owned listing fails", async () => {
  vi.mocked(getOwnedIlan).mockRejectedValue(new Error("forbidden"));
  render(<IlanVerForm editId="missing" />);
  await screen.findByRole("alert");
  expect(screen.queryByRole("button", { name: "Devam et" })).not.toBeInTheDocument();
});
