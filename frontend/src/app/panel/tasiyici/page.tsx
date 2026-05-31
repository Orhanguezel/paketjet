import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";

export default function LegacyTasiyiciPanelPage() {
  redirect(ROUTES.panel.root);
}
