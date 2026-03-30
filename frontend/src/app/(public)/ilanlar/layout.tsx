import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("listings", {
    title: "Taşıma İlanları",
    description: "Aktif kargo taşıma ilanları. Şehir, tarih ve araç tipine göre filtrele, en uygun taşıyıcıyı bul.",
  });
}

export default function IlanlarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
