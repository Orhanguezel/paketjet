import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — Tailwind class birleştirici
 * clsx koşullu class'lar için, tailwind-merge çakışmaları çözer.
 * Kullanım: cn("bg-brand", isActive && "ring-2", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sürücü adını gizler: "Ahmet Hakan" → "A.H."
 */
export function maskName(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() + ".")
    .join("");
}

/**
 * Tarih formatlar: "2026-03-15" → "15 Mar 2026"
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * KG aralığını okuma dostu stringe çevirir
 */
export function formatKg(min: number, max: number): string {
  if (min === max) return `${min} kg`;
  return `${min}–${max} kg`;
}
