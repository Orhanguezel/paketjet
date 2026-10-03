export type IdentityStatus = "pending" | "approved" | "rejected";

export type IdentitySide = "front" | "back";

export interface IdentityDocument {
  status: IdentityStatus;
  reject_reason: string | null;
  reviewed_at: string | null;
  uploaded_at: string;
  version: number;
}

export interface IdentityState {
  front: IdentityDocument | null;
  back: IdentityDocument | null;
}
