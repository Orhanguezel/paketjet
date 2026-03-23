// src/modules/ilanlar/index.ts
// External module surface for ilanlar. Keep explicit; no export *.

export { registerIlanlar } from './router';
export { registerIlanlarAdmin } from './admin.routes';

export {
  listIlans,
  getIlan,
  listMyIlans,
  createIlan,
  updateIlan,
  updateStatus,
  deleteIlan,
} from './controller';

export {
  adminListIlans,
  adminGetIlan,
  adminUpdateIlanStatus,
  adminDeleteIlan,
} from './admin.controller';

export {
  repoGetIlanById,
  repoListIlans,
  repoCreateIlan,
  repoUpdateIlan,
  repoUpdateIlanStatus,
  repoDeleteIlan,
  repoGetUserIlans,
  repoDeductCapacity,
  repoRestoreCapacity,
  repoCountActiveIlans,
  repoAddIlanPhoto,
  repoDeleteIlanPhoto,
} from './repository';

export {
  mapIlanRow,
  buildIlanListWhere,
  buildCreateIlanInsert,
  getUserIlanOrder,
  createIlanInsertPayload,
  buildIlanPatch,
  parseAdminIlanListParams,
  parseAdminCarriersListParams,
} from './helpers';

export {
  repoAdminListIlans,
} from './admin.repository';

export {
  createIlanSchema,
  updateIlanSchema,
  searchIlansSchema,
  updateIlanStatusSchema,
} from './validation';

export {
  ilanlar,
  ilanPhotos,
} from './schema';
export type {
  Ilan,
  NewIlan,
  IlanPhoto,
  NewIlanPhoto,
} from './schema';
