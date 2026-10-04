import { API } from '@/config/api-endpoints';
import { getPublicJson } from '@/lib/public-fetch';
import type { PublicTheme } from '@/lib/storefront-theme-css';

export const getStorefrontTheme = () => getPublicJson<PublicTheme>(API.theme.storefront, 30);
