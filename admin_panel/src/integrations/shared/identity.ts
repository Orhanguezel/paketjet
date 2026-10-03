// src/integrations/shared/identity.ts
export const IDENTITY_ADMIN_BASE = '/admin/identity';

export type IdentityStatus = 'pending' | 'approved' | 'rejected';
export type IdentitySide = 'front' | 'back';

export interface IdentityListItem {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  status: IdentityStatus;
  has_front: boolean;
  has_back: boolean;
  reject_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}
