// src/integrations/shared/identity.ts
export const IDENTITY_ADMIN_BASE = '/admin/identity';

export type IdentityStatus = 'pending' | 'approved' | 'rejected';

export interface IdentityListItem {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  status: IdentityStatus;
  reject_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}
