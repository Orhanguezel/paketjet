export type KycDocumentType = "identity_front" | "identity_back" | "tax_certificate" | "address_proof" | "iban_document";
export type KycDocumentStatus = "pending" | "approved" | "rejected";
export type KycStatus = "not_submitted" | "pending" | "approved" | "rejected";

export interface KycDocument {
  id: string;
  carrier_id: string;
  document_type: KycDocumentType;
  file_path: string;
  original_name: string;
  file_size: number;
  status: KycDocumentStatus;
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface KycStatusResponse {
  kyc_status: KycStatus;
  kyc_submitted_at: string | null;
  kyc_approved_at: string | null;
  tc_identity: string | null;
  tax_number: string | null;
  tax_office: string | null;
  legal_company_title: string | null;
  iyzico_sub_merchant_key: string | null;
  documents: KycDocument[];
  document_count: number;
  approved_count: number;
}

export const KYC_DOC_TYPE_LABELS: Record<KycDocumentType, string> = {
  identity_front: "Kimlik Ön Yüz",
  identity_back: "Kimlik Arka Yüz",
  tax_certificate: "Vergi Levhası",
  address_proof: "Adres Belgesi",
  iban_document: "IBAN Belgesi",
};

export const KYC_STATUS_LABELS: Record<KycStatus, string> = {
  not_submitted: "Başvuru Yapılmadı",
  pending: "İnceleniyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

export const KYC_DOC_STATUS_LABELS: Record<KycDocumentStatus, string> = {
  pending: "Bekliyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};
