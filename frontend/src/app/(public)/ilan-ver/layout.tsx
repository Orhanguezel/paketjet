import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("ilan_ver", {
    title: "Ilan Ver",
    description: "Tasiyici olarak ilan ver. Guzergah, kapasite ve fiyat bilgilerini gir, musteri bulsun.",
  });
}

export default function IlanVerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
