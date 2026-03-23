// src/modules/ratings/index.ts
// External module surface for ratings. Keep explicit; no export *.

export { registerRatings } from './router';

export {
  createRating,
  getBookingRating,
  getCarrierRatings,
} from './controller';

export {
  repoCreateRating,
  repoGetRatingByBooking,
  repoGetCarrierRatings,
  repoGetCarrierAvgRating,
} from './repository';

export {
  parseCarrierRatingsPaging,
  toCarrierRatingStats,
} from './helpers';

export {
  createRatingSchema,
} from './validation';
export type {
  CreateRatingInput,
} from './validation';

export { ratings } from './schema';
export type {
  Rating,
  NewRating,
} from './schema';
