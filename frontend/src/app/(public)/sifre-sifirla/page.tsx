import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import SifreSifirlaClient from "./sifre-sifirla-client";

export function generateMetadata(): Metadata {
  return noIndexMetadata("Şifre sıfırla", "Hesabınıza ait yeni şifrenizi belirleyerek erişiminizi yenileyin.");
}

export default function SifreSifirlaPage() {
  return <SifreSifirlaClient />;
}
