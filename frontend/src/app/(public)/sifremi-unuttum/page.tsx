import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import SifremiUnuttumClient from "./sifremi-unuttum-client";

export function generateMetadata(): Metadata {
  return noIndexMetadata("Şifremi unuttum", "Hesabınıza ait şifre sıfırlama bağlantısı talep edin.");
}

export default function SifremiUnuttumPage() {
  return <SifremiUnuttumClient />;
}
