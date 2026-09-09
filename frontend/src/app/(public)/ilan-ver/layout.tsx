import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("ilan_ver", {
    title: "İlan Ver",
    description: "Güzergâhını ücretsiz paylaş. Rota, araç ve iletişim bilgilerini adım adım doldur, ilanını incelemeye gönder.",
  });
}

export default function IlanVerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
