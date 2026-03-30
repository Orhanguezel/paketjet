import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import SifreSifirlaClient from "./sifre-sifirla-client";

export function generateMetadata(): Metadata {
  return noIndexMetadata("Sifre Sifirla | PaketJet", "PaketJet hesabiniza ait yeni sifrenizi belirleyerek erisiminizi yenileyin.");
}

export default function SifreSifirlaPage() {
  return <SifreSifirlaClient />;
}
