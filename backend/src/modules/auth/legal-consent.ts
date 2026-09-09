import { repoGetCustomPageBySlug } from '@/modules/customPages/repository';
import { repoPreserveContent } from '@/modules/customPages/revision.repository';
export async function getSignupLegalConsentVersions() {
  const [terms, kvkk] = await Promise.all([
    repoGetCustomPageBySlug('kullanim-kosullari', 'tr'),
    repoGetCustomPageBySlug('kvkk', 'tr'),
  ]);
  if (!terms?.is_published || !kvkk?.is_published) throw Object.assign(new Error('legal_content_unavailable'), {statusCode:503});
  return {
    rules_accepted_version: await repoPreserveContent(terms),
    kvkk_consent_version: await repoPreserveContent(kvkk),
  };
}
