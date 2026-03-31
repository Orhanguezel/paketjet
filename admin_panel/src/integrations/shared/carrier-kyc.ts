// src/integrations/shared/carrier-kyc.ts

export const KYC_ADMIN_BASE = '/admin/kyc';

export type KycDocumentType = 'identity_front' | 'identity_back' | 'tax_certificate' | 'address_proof' | 'iban_document';
export type KycDocumentStatus = 'pending' | 'approved' | 'rejected';
export type KycStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

export interface KycDocumentItem {
  id: string;
  carrier_id: string;
  document_type: KycDocumentType;
  file_path: string;
  original_name: string;
  file_size: number;
  status: KycDocumentStatus;
  admin_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  carrier_name?: string | null;
  carrier_email?: string | null;
}

export interface KycDocumentListResponse {
  data: KycDocumentItem[];
  total: number;
  page: number;
  limit: number;
}

export interface CarrierKycDetail {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  tc_identity: string | null;
  tax_number: string | null;
  tax_office: string | null;
  legal_company_title: string | null;
  kyc_status: KycStatus;
  kyc_submitted_at: string | null;
  kyc_approved_at: string | null;
  iyzico_sub_merchant_key: string | null;
  iyzico_sub_merchant_type: string | null;
  documents: KycDocumentItem[];
}

export interface KycListParams {
  status?: string;
  page?: number;
}

export interface ReviewDocumentPayload {
  id: string;
  status: 'approved' | 'rejected';
  admin_note?: string;
}

export const KYC_DOC_TYPE_LABEL: Record<KycDocumentType, string> = {
  identity_front: 'Kimlik Ön Yüz',
  identity_back: 'Kimlik Arka Yüz',
  tax_certificate: 'Vergi Levhası',
  address_proof: 'Adres Belgesi',
  iban_document: 'IBAN Belgesi',
};

export const KYC_STATUS_LABEL: Record<KycStatus, string> = {
  not_submitted: 'Başvuru Yapılmadı',
  pending: 'İnceleniyor',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
};

export const KYC_DOC_STATUS_LABEL: Record<KycDocumentStatus, string> = {
  pending: 'Bekliyor',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
};
