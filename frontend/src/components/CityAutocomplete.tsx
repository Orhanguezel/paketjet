"use client";

import { useState, useRef, useEffect } from "react";
import { TURKEY_CITIES } from "@/data/turkey-cities";

type Props = {
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
};

function normalize(s: string) {
  return s.toLowerCase().replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c");
}

export default function CityAutocomplete({ value, onChange, placeholder = "İl seçin" }: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = search.trim()
    ? TURKEY_CITIES.filter((c) => normalize(c.label).includes(normalize(search)))
    : TURKEY_CITIES;

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function select(city: string) {
    onChange(city);
    setSearch("");
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-11 w-full flex items-center gap-2 border border-border rounded-lg px-3 bg-background text-left hover:border-brand/40 transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className={`flex-1 text-sm truncate ${value ? "text-foreground" : "text-muted"}`}>
          {value || placeholder}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-9999 mt-1 w-full min-w-52 rounded-lg border border-border bg-surface shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-2 h-9 rounded-md border border-border px-2.5 bg-background focus-within:ring-2 focus-within:ring-brand/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="İl ara..."
                className="flex-1 text-sm outline-none bg-transparent text-foreground placeholder:text-faint"
                autoFocus
              />
            </div>
          </div>

          {/* List */}
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length > 0 ? (
              filtered.map((city) => (
                <li
                  key={city.value}
                  onClick={() => select(city.label)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
                    value === city.label
                      ? "bg-brand/10 text-brand font-medium"
                      : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand/50">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {city.label}
                  {value === city.label && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="ml-auto text-brand">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </li>
              ))
            ) : (
              <li className="px-3 py-4 text-sm text-muted text-center">Sonuç bulunamadı</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
