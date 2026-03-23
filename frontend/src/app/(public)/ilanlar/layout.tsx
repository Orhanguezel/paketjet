import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("listings", {
    title: "Tasima Ilanlari",
    description: "Aktif kargo tasima ilanlari. Sehir, tarih ve arac tipine gore filtrele, en uygun tasiyiciyi bul.",
  });
}

export default function IlanlarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
