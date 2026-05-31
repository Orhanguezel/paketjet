import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("ilan_ver", {
    title: "İlan Ver",
    description: "Gönderini ücretsiz ilan olarak yayınla. Güzergah, tarih, iletişim ve değer beyanını gir.",
  });
}

export default function IlanVerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
