// src/modules/purchases/index.ts — explicit barrel (no export *)
export { registerPurchases } from "./router";
export { repoGrantCredits, repoGetCreditBalance } from "./repository";
export { ilanPurchases, userCredits, creditLedger } from "./schema";
