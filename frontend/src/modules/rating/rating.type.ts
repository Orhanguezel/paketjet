export interface Rating {
  id: string;
  booking_id: string;
  customer_id: string;
  carrier_id: string;
  score: number;
  comment: string | null;
  created_at: string;
}

export interface CarrierRatingsResponse {
  data: (Rating & { customer_name: string | null })[];
  avg_score: number;
  total: number;
}

export interface CreateRatingInput {
  booking_id: string;
  score: number;
  comment?: string;
}
