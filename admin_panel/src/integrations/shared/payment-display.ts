export const paymentErrorLabels: Record<string, string> = {
  confirmation_overdue: "Ödeme onayı süresinde doğrulanamadı",
  abandoned_demo_checkout: "Test ödeme işlemi tamamlanmadı",
  legacy_unverified: "Eski ödeme kaydı doğrulanamadı",
  refund_requested: "İade talebi gönderildi",
  refund_credits_already_used: "İade incelemesi: haklar kullanılmış",
  bank_rejected: "Havale bildirimi reddedildi",
  shopier_checkout_failed: "Shopier ödeme sayfası oluşturulamadı",
  shopier_receipt_conflict: "Shopier ödeme bildirimi eşleştirilemedi",
  delivery_unavailable: "Ödeme sonrası ilan erişimi sağlanamadı",
};

export const paymentErrorLabel = (code: string) => paymentErrorLabels[code] ?? "İşlem incelemesi gerekiyor";
export const paymentShortRef = (reference: string) => reference.slice(-8).toUpperCase();
