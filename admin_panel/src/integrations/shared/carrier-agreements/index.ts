// src/integrations/shared/carrier-agreements/index.ts
export {
  ADMIN_CARRIER_AGREEMENTS_BASE,
  ADMIN_CARRIER_AGREEMENTS_DEFAULT_LIMIT,
  AGREEMENT_TYPES,
  AGREEMENT_STATUSES,
  buildCarrierAgreementListParams,
  pickCarrierAgreementListQuery,
  toCarrierAgreementSearchParams,
  type AgreementType,
  type AgreementStatus,
  type CarrierAgreementDto,
  type CarrierAgreementListResponse,
  type CarrierAgreementListParams,
  type CreateCarrierAgreementBody,
  type UpdateCarrierAgreementBody,
} from './carrier-agreements-types';

export {
  getAgreementCarrierName,
  formatCommissionRate,
  getEffectiveCommissionRate,
  getAgreementsPreviousOffset,
  getAgreementsNextOffset,
} from './carrier-agreements-ui';
