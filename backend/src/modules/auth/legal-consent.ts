import { repoGetCustomPageBySlug } from '@/modules/customPages/repository';

function consentVersion(slug: string, updatedAt?: string | Date | null) {
  const stamp = updatedAt ? new Date(updatedAt).toISOString() : 'unversioned';
  return `${slug}@${stamp}`;
}

export async function getSignupLegalConsentVersions() {
  const [terms, kvkk] = await Promise.all([
    repoGetCustomPageBySlug('kullanim-kosullari', 'tr'),
    repoGetCustomPageBySlug('kvkk', 'tr'),
  ]);

  return {
    rules_accepted_version: consentVersion('kullanim-kosullari', terms?.updated_at),
    kvkk_consent_version: consentVersion('kvkk', kvkk?.updated_at),
  };
}
