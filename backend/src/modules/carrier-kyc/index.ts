// src/modules/carrier-kyc/index.ts
export { registerCarrierKyc } from "./router";
export { registerCarrierKycAdmin } from "./admin.routes";
export { carrierKycDocuments, kycDocumentTypes, kycDocumentStatuses, kycStatuses } from "./schema";
export type { CarrierKycDocument, KycDocumentType, KycDocumentStatus, KycStatus } from "./schema";
export { repoGetKycStatus, repoSyncKycStatus } from "./repository";
