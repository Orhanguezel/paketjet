import { apiGet, apiDelete } from "@/lib/api-client";
import type { KycStatusResponse, KycDocument, KycDocumentType } from "./carrier-kyc.type";

const BASE = "/api/carrier-kyc";

export function getKycStatus(): Promise<KycStatusResponse> {
  return apiGet<KycStatusResponse>(`${BASE}/status`);
}

export function getKycDocuments(): Promise<KycDocument[]> {
  return apiGet<KycDocument[]>(`${BASE}/documents`);
}

export async function uploadKycDocument(data: {
  document_type: KycDocumentType;
  file: File;
  tc_identity?: string;
  iban?: string;
  tax_number?: string;
  tax_office?: string;
  legal_company_title?: string;
}): Promise<KycDocument> {
  const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
  const formData = new FormData();
  formData.append("document_type", data.document_type);
  formData.append("file", data.file);
  if (data.tc_identity) formData.append("tc_identity", data.tc_identity);
  if (data.iban) formData.append("iban", data.iban);
  if (data.tax_number) formData.append("tax_number", data.tax_number);
  if (data.tax_office) formData.append("tax_office", data.tax_office);
  if (data.legal_company_title) formData.append("legal_company_title", data.legal_company_title);

  const res = await fetch(`${BASE_URL}${BASE}/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? "upload_failed");
  }

  return res.json();
}

export function deleteKycDocument(id: string): Promise<{ ok: boolean }> {
  return apiDelete<{ ok: boolean }>(`${BASE}/${id}`);
}
