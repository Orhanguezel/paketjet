import IlanVerClient from "./ilan-ver-client";

// Yeni model: rol ayrımı YOK — giriş yapmış HER kullanıcı ücretsiz ilan açabilir.
// (Eski "sadece taşıyıcı" rol kapısı kaldırıldı; auth/yönlendirme IlanVerClient içinde.)
export default function IlanVerPage() {
  return <IlanVerClient />;
}
