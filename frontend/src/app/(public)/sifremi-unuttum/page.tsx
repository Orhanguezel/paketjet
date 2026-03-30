import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import SifremiUnuttumClient from "./sifremi-unuttum-client";

export function generateMetadata(): Metadata {
  return noIndexMetadata("Sifremi Unuttum | PaketJet", "PaketJet hesabiniza ait sifre sifirlama baglantisi talep edin.");
}

export default function SifremiUnuttumPage() {
  return <SifremiUnuttumClient />;
}
