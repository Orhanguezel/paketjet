export interface MemberRating {
  id: string;
  score: number;
  comment: string | null;
  created_at: string;
}
export interface MemberRatingsResponse {
  member_id: string;
  member_name: string;
  average: number | null;
  total: number;
  data: MemberRating[];
}
export interface EligibleRating {
  purchase_id: string;
  member_id: string;
  member_name: string;
  title: string;
  created_at: string;
  rated: boolean;
}
