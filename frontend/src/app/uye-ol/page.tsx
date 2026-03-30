import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import UyeOlClient from "./uye-ol-client";

export function generateMetadata(): Metadata {
  return noIndexMetadata("Uye Ol | PaketJet", "PaketJet hesabi olusturarak ilanlari yonetin, rezervasyon surecini takip edin ve panel ozelliklerine erisin.");
}

export default function UyeOlPage() {
  return <UyeOlClient />;
}
