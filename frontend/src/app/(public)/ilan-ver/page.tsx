import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";
import IlanVerClient from "./ilan-ver-client";

export function generateMetadata(): Metadata {
  return noIndexMetadata("İlan Ver", "Taşıma kapasitenizi PaketJet üzerinde ilan olarak yayınlayın.");
}

export default function IlanVerPage() {
  return <IlanVerClient />;
}
