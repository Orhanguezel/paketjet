import { API } from '@/config/api-endpoints';
import { apiGet, apiPost } from '@/lib/api-client';
import type { EligibleRating, MemberRatingsResponse } from './member-rating.type';

export const getMemberRatings = (id: string) => apiGet<MemberRatingsResponse>(API.ratings.member(id));
export const getEligibleRatings = () => apiGet<{data:EligibleRating[]}>(API.ratings.eligible, { cache: 'no-store' });
export const submitPurchaseRating = (id: string, score: number, comment: string) => apiPost<{ok:true;id:string}>(API.ratings.purchase(id), { score, comment });
