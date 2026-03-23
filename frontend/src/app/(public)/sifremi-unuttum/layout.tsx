import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Sifremi Unuttum");

export default function SifremiUnuttumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
