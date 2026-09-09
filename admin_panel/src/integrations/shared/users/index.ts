export type {
  AdminRemoveUserBody,
  AdminSetActiveBody,
  AdminSetPasswordBody,
  AdminSetRolesBody,
  AdminUpdateUserBody,
  AdminUserRaw,
  AdminUserView,
  AdminUsersListParams,
  ProfileRow,
  UserRoleName,
} from '@/integrations/shared/users/users';

export {
  ADMIN_USERS_ALL_ROLES,
  ADMIN_USERS_DEFAULT_LIMIT,
  getAdminUserDisplayName,
  getAdminUserPrimaryRole,
  getAdminUserRoleLocaleKey,
  getAdminUsersNextOffset,
  getAdminUsersPreviousOffset,
  isAdminUserView,
  parseAdminUsersBoolParam,
  pickAdminUsersQuery,
  toAdminUsersSearchParams,
} from '@/integrations/shared/users/admin-users-ui';

export {
  type AuthMeNormalized,
  type AuthMeResponse,
  type AuthSignupBody,
  type AuthStatusResponse,
  type AuthTokenBody,
  type AuthTokenRefreshResponse,
  type AuthTokenResponse,
  type AuthUpdateBody,
  type AuthUser,
  type PasswordResetConfirmBody,
  type PasswordResetConfirmResponse,
  type PasswordResetRequestBody,
  type PasswordResetRequestResponse,
  normalizeMeFromStatus,
} from '@/integrations/shared/users/auth-public';

export type {
  UserRole,
  UserRolesListParams,
} from '@/integrations/shared/users/user-roles';

export {
  normalizeAdminUser,
} from '@/integrations/shared/users/admin-users-normalize';

export {
  normalizeProfile,
} from '@/integrations/shared/users/profiles-normalize';

export type {
  GetMyProfileArg,
  GetMyProfileResp,
  Profile,
  ProfileSocial,
  ProfileUpsertInput,
  UpsertMyProfileArg,
  UpsertMyProfileReq,
  UpsertMyProfileResp,
} from '@/integrations/shared/users/profiles';

export {
  type AdminOkResponse,
  ADMIN_USERS_BASE,
  type AdminUserDto,
  type AdminUserListQueryParams,
  type AdminUserRoleName,
  type AdminUserSetActivePayload,
  type AdminUserSetPasswordPayload,
  type AdminUserSetRolesPayload,
  type AdminUserUpdatePayload,
  buildAdminUsersListParams,
  type MaybeUsersListResponse,
  unwrapAdminUser,
  unwrapAdminUsersList,
} from '@/integrations/shared/users/admin-users-types';
