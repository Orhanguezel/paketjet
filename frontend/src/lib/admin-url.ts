// Yonetim paneli adresi dagitim ortamindan gelir; kodda alan adi yazmaz.
import { notFound, redirect } from "next/navigation";

export const ADMIN_URL = (process.env.NEXT_PUBLIC_ADMIN_URL ?? "").replace(/\/$/, "");

/** Eski /admin/* adreslerini panele yonlendirir; panel adresi tanimli degilse sayfa yoktur. */
export function redirectToAdmin(path: string): never {
  if (!ADMIN_URL) notFound();
  redirect(`${ADMIN_URL}${path}`);
}
