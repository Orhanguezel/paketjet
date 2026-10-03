export type IdentityStatus = "pending" | "approved" | "rejected";

export interface IdentityFront {
  status: IdentityStatus;
  reject_reason: string | null;
  reviewed_at: string | null;
  uploaded_at: string;
  version: number;
}

export interface IdentityState {
  front: IdentityFront | null;
}
