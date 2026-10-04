import { baseApi } from "@/integrations/base-api";
import type { ScopedThemeConfig, ThemeConfig, ThemeScope } from "@/integrations/shared";

export const scopedThemeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getScopedTheme: build.query<ScopedThemeConfig, ThemeScope>({
      query: (scope) => ({ url: `/admin/theme/${scope}`, method: "GET" }),
      providesTags: (_result, _error, scope) => [{ type: "Settings", id: `THEME_${scope}` }],
    }),
    updateScopedTheme: build.mutation<ScopedThemeConfig, { scope: ThemeScope; draft: Partial<ThemeConfig> }>({
      query: ({ scope, draft }) => ({ url: `/admin/theme/${scope}`, method: "PUT", body: draft }),
      invalidatesTags: (_result, _error, { scope }) => [{ type: "Settings", id: `THEME_${scope}` }],
    }),
    resetScopedTheme: build.mutation<ScopedThemeConfig, ThemeScope>({
      query: (scope) => ({ url: `/admin/theme/${scope}/reset`, method: "POST" }),
      invalidatesTags: (_result, _error, scope) => [{ type: "Settings", id: `THEME_${scope}` }],
    }),
  }),
});

export const { useGetScopedThemeQuery, useUpdateScopedThemeMutation, useResetScopedThemeMutation } = scopedThemeApi;
