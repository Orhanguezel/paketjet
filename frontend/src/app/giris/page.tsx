import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import GirisClient from "./giris-client";

export function generateMetadata(): Metadata {
  return noIndexMetadata("Giris Yap | PaketJet", "PaketJet hesabiniza giris yaparak ilan, rezervasyon ve destek sureclerine erisin.");
}

export default function GirisPage() {
  return <GirisClient />;
}
