import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Sifre Sifirla");

export default function SifreSifirlaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
