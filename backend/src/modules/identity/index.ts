// src/modules/identity/index.ts
// Kimlik belgesi (on yuz) — ozel depoda, yalniz sahibi + admin erisir.
export { registerIdentity } from './router';
export { registerIdentityAdmin } from './admin.routes';
export { identityDocuments } from './schema';
