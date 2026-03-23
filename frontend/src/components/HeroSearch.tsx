"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TABS = ["Kargo Gönder", "Paket Takip", "Fiyat Hesapla"] as const;
type Tab = (typeof TABS)[number];

const WEIGHT_OPTIONS = ["1-5 kg", "5-10 kg", "10-20 kg", "20-50 kg", "50+ kg"];

export default function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Kargo Gönder");
  const [nereden, setNereden] = useState("");
  const [nereye, setNereye] = useState("");
  const [tarih, setTarih] = useState("");

  function swap() {
    setNereden(nereye);
    setNereye(nereden);
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (nereden) params.set("from", nereden);
    if (nereye) params.set("to", nereye);
    if (tarih) params.set("date", tarih);
    router.push(`/ilanlar${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <section className="relative min-h-150 overflow-hidden">
      {/* Background image overlay */}
      <Image
        src="/assets/images/featured.png"
        alt="Paketlerin raflarda hazırlandığı lojistik depo görünümü"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-20 flex flex-col items-center text-center gap-6">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand/90 text-white text-[11px] font-semibold rounded-full">
          <Image
            src="/assets/icons/flash.png"
            alt="Hız etiketi simgesi"
            width={14}
            height={14}
            className="h-3.5 w-3.5"
          />
          Türkiye&apos;nin En Hızlı Kargo Ağı
        </span>

        {/* Heading */}
        <h1 className="max-w-3xl text-5xl md:text-6xl font-black text-white leading-[1.04] tracking-tight" style={{ textWrap: "balance" }}>
          Paketini <span className="text-brand">hızlı</span> ve kullanışlı gönder
        </h1>
        <p className="max-w-2xl text-base text-white/80">
          Tüm kargo gereksinimlerinizi tek platformda karşılayın. Gönderi takip ve teslim yönetimi burada.
        </p>

        {/* Search Card */}
        <div className="w-full max-w-5xl bg-surface rounded-2xl shadow-2xl border border-border-soft px-5 py-5 mt-2">
          {/* Tabs */}
          <div className="flex items-center gap-2 pb-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  activeTab === tab
                    ? "bg-brand text-white"
                    : "bg-bg-alt text-muted hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form */}
          <div>
            {activeTab === "Kargo Gönder" && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
                {/* Nereden */}
                <div className="md:col-span-3">
                  <p className="mb-1.5 text-sm font-semibold text-muted text-left">Nereden</p>
                  <div className="h-11 flex items-center gap-2 border border-border rounded-lg px-3 bg-background focus-within:ring-2 focus-within:ring-brand/30 transition">
                    <Image
                      src="/assets/icons/location.png"
                      alt="Kalkış konumu simgesi"
                      width={16}
                      height={16}
                      className="h-4 w-4 shrink-0"
                    />
                    <input
                      type="text"
                      placeholder="Şehir veya şehir"
                      value={nereden}
                      onChange={(e) => setNereden(e.target.value)}
                      className="flex-1 text-sm outline-none text-foreground placeholder:text-faint bg-transparent"
                    />
                  </div>
                </div>

                {/* Swap */}
                <button
                  onClick={swap}
                  aria-label="Nereden ve nereye alanlarını değiştir"
                  className="hidden md:flex md:col-span-1 self-end mb-1 h-11 w-11 items-center justify-center rounded-full border border-border hover:bg-bg-alt transition shrink-0"
                >
                  <Image
                    src="/assets/icons/compare.png"
                    alt="Alan değiştir simgesi"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                </button>

                {/* Nereye */}
                <div className="md:col-span-3">
                  <p className="mb-1.5 text-sm font-semibold text-muted text-left">Nereye</p>
                  <div className="h-11 flex items-center gap-2 border border-border rounded-lg px-3 bg-background focus-within:ring-2 focus-within:ring-brand/30 transition">
                    <Image
                      src="/assets/icons/location.png"
                      alt="Varış konumu simgesi"
                      width={16}
                      height={16}
                      className="h-4 w-4 shrink-0"
                    />
                    <input
                      type="text"
                      placeholder="Şehir veya şehir"
                      value={nereye}
                      onChange={(e) => setNereye(e.target.value)}
                      className="flex-1 text-sm outline-none text-foreground placeholder:text-faint bg-transparent"
                    />
                  </div>
                </div>

                {/* Tarih */}
                <div className="md:col-span-2">
                  <p className="mb-1.5 text-sm font-semibold text-muted text-left">Tarih</p>
                  <div className="h-11 flex items-center gap-2 border border-border rounded-lg px-3 bg-background focus-within:ring-2 focus-within:ring-brand/30 transition">
                    <Image
                      src="/assets/icons/order.png"
                      alt="Tarih seçimi simgesi"
                      width={16}
                      height={16}
                      className="h-4 w-4 shrink-0"
                    />
                    <input
                      type="date"
                      value={tarih}
                      onChange={(e) => setTarih(e.target.value)}
                      className="text-sm outline-none text-muted w-full bg-transparent"
                    />
                  </div>
                </div>

                {/* Ağırlık */}
                <div className="md:col-span-2">
                  <p className="mb-1.5 text-sm font-semibold text-muted text-left">Ağırlık</p>
                  <div className="h-11 flex items-center gap-2 border border-border rounded-lg px-3 bg-background focus-within:ring-2 focus-within:ring-brand/30 transition">
                    <Image
                      src="/assets/icons/box_open.png"
                      alt="Ağırlık seçimi simgesi"
                      width={16}
                      height={16}
                      className="h-4 w-4 shrink-0 brightness-0 opacity-70"
                    />
                    <select className="text-sm outline-none text-muted bg-transparent pr-1 w-full">
                      {WEIGHT_OPTIONS.map((w) => (
                        <option key={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ara */}
                <button
                  onClick={handleSearch}
                  className="md:col-span-1 inline-flex items-center justify-center h-11 min-w-28 px-6 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors shrink-0"
                >
                  Ara
                </button>
              </div>
            )}

            {activeTab === "Paket Takip" && (
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Takip numaranızı girin"
                  className="flex-1 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30 text-foreground placeholder:text-faint bg-background"
                />
                <button className="px-8 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                  Takip Et
                </button>
              </div>
            )}

            {activeTab === "Fiyat Hesapla" && (
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Nereden"
                  className="flex-1 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30 text-foreground placeholder:text-faint bg-background"
                />
                <input
                  type="text"
                  placeholder="Nereye"
                  className="flex-1 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/30 text-foreground placeholder:text-faint bg-background"
                />
                <select className="border border-border rounded-lg px-3 py-2.5 text-sm outline-none text-muted bg-background">
                  {WEIGHT_OPTIONS.map((w) => (
                    <option key={w}>{w}</option>
                  ))}
                </select>
                <button className="px-8 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                  Hesapla
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
