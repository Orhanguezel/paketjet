import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata("Üye Ol");

export default function UyeOlLayout({ children }: { children: React.ReactNode }) {
  return children;
}
