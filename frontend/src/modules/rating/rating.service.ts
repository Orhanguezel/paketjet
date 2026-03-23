import { apiGet, apiPost } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { Rating, CarrierRatingsResponse, CreateRatingInput } from "./rating.type";

export const createRating = (input: CreateRatingInput) =>
  apiPost<Rating>(API.ratings.create, input);

export const getBookingRating = (bookingId: string) =>
  apiGet<Rating | null>(API.ratings.byBooking(bookingId));

export const getCarrierRatings = (carrierId: string, limit = 10) =>
  apiGet<CarrierRatingsResponse>(`${API.ratings.byCarrier(carrierId)}?limit=${limit}`);
