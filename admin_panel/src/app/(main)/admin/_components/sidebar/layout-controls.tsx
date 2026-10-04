// src/app/(main)/dashboard/_components/sidebar/layout-controls.tsx

"use client";

import { Settings } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ContentLayout, NavbarStyle, SidebarCollapsible, SidebarVariant } from "@/lib/preferences/layout";
import {
  applyContentLayout,
  applyNavbarStyle,
  applySidebarCollapsible,
  applySidebarVariant,
} from "@/lib/preferences/layout-utils";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import { useAdminSettings } from '../admin-settings-provider';
import { useAdminTranslations, ADMIN_LOCALE_OPTIONS } from '@/i18n';

export function LayoutControls() {
  const { saveAdminConfig } = useAdminSettings();
  const adminLocale = usePreferencesStore((s) => s.adminLocale);
  const setAdminLocale = usePreferencesStore((s) => s.setAdminLocale);
  const t = useAdminTranslations(adminLocale || undefined);
  const contentLayout = usePreferencesStore((s) => s.contentLayout);
  const setContentLayout = usePreferencesStore((s) => s.setContentLayout);
  const navbarStyle = usePreferencesStore((s) => s.navbarStyle);
  const setNavbarStyle = usePreferencesStore((s) => s.setNavbarStyle);
  const variant = usePreferencesStore((s) => s.sidebarVariant);
  const setSidebarVariant = usePreferencesStore((s) => s.setSidebarVariant);
  const collapsible = usePreferencesStore((s) => s.sidebarCollapsible);
  const setSidebarCollapsible = usePreferencesStore((s) => s.setSidebarCollapsible);

  const onContentLayoutChange = async (layout: ContentLayout | "") => {
    if (!layout) return;
    applyContentLayout(layout);
    setContentLayout(layout);
    persistPreference("content_layout", layout);
    saveAdminConfig();
  };

  const onNavbarStyleChange = async (style: NavbarStyle | "") => {
    if (!style) return;
    applyNavbarStyle(style);
    setNavbarStyle(style);
    persistPreference("navbar_style", style);
    saveAdminConfig();
  };

  const onSidebarStyleChange = async (value: SidebarVariant | "") => {
    if (!value) return;
    setSidebarVariant(value);
    applySidebarVariant(value);
    persistPreference("sidebar_variant", value);
    saveAdminConfig();
  };

  const onSidebarCollapseModeChange = async (value: SidebarCollapsible | "") => {
    if (!value) return;
    setSidebarCollapsible(value);
    applySidebarCollapsible(value);
    persistPreference("sidebar_collapsible", value);
    saveAdminConfig();
  };

  const onAdminLocaleChange = (value: string) => {
    const next = String(value || '').trim();
    if (!next) return;
    setAdminLocale(next);
    persistPreference("admin_locale", next);
    saveAdminConfig();
  };

  const handleRestore = () => {
    onContentLayoutChange(PREFERENCE_DEFAULTS.content_layout);
    onNavbarStyleChange(PREFERENCE_DEFAULTS.navbar_style);
    onSidebarStyleChange(PREFERENCE_DEFAULTS.sidebar_variant);
    onSidebarCollapseModeChange(PREFERENCE_DEFAULTS.sidebar_collapsible);
    onAdminLocaleChange(PREFERENCE_DEFAULTS.admin_locale);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon">
          <Settings />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <h4 className="font-medium text-sm leading-none">{t('admin.sidebar.preferences.title')}</h4>
            <p className="text-muted-foreground text-xs">{t('admin.sidebar.preferences.description')}</p>
          </div>
          <div className="space-y-3 **:data-[slot=toggle-group]:w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs">
            <Link href="/admin/theme" className="text-primary text-xs font-semibold underline-offset-4 hover:underline">
              Tema renkleri, yazı tipleri ve görünüm modu
            </Link>

            <div className="space-y-1">
              <Label className="font-medium text-xs">{t('admin.sidebar.preferences.language')}</Label>
              <Select value={adminLocale || 'tr'} onValueChange={onAdminLocaleChange}>
                <SelectTrigger size="sm" className="w-full text-xs">
                  <SelectValue placeholder={t('admin.sidebar.preferences.languagePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_LOCALE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} className="text-xs" value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="font-medium text-xs">{t('admin.sidebar.preferences.pageLayout')}</Label>
              <ToggleGroup
                size="sm"
                variant="outline"
                type="single"
                value={contentLayout}
                onValueChange={onContentLayoutChange}
              >
                <ToggleGroupItem value="centered" aria-label={t('admin.sidebar.preferences.aria.layoutCentered')}>
                  {t('admin.sidebar.preferences.layout.centered')}
                </ToggleGroupItem>
                <ToggleGroupItem value="full-width" aria-label={t('admin.sidebar.preferences.aria.layoutFullWidth')}>
                  {t('admin.sidebar.preferences.layout.fullWidth')}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="font-medium text-xs">{t('admin.sidebar.preferences.navbarBehavior')}</Label>
              <ToggleGroup
                size="sm"
                variant="outline"
                type="single"
                value={navbarStyle}
                onValueChange={onNavbarStyleChange}
              >
                <ToggleGroupItem value="sticky" aria-label={t('admin.sidebar.preferences.aria.navbarSticky')}>
                  {t('admin.sidebar.preferences.navbar.sticky')}
                </ToggleGroupItem>
                <ToggleGroupItem value="scroll" aria-label={t('admin.sidebar.preferences.aria.navbarScroll')}>
                  {t('admin.sidebar.preferences.navbar.scroll')}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="font-medium text-xs">{t('admin.sidebar.preferences.sidebarStyle')}</Label>
              <ToggleGroup
                size="sm"
                variant="outline"
                type="single"
                value={variant}
                onValueChange={onSidebarStyleChange}
              >
                <ToggleGroupItem value="inset" aria-label={t('admin.sidebar.preferences.aria.sidebarInset')}>
                  {t('admin.sidebar.preferences.sidebarVariant.inset')}
                </ToggleGroupItem>
                <ToggleGroupItem value="sidebar" aria-label={t('admin.sidebar.preferences.aria.sidebarStandard')}>
                  {t('admin.sidebar.preferences.sidebarVariant.sidebar')}
                </ToggleGroupItem>
                <ToggleGroupItem value="floating" aria-label={t('admin.sidebar.preferences.aria.sidebarFloating')}>
                  {t('admin.sidebar.preferences.sidebarVariant.floating')}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="font-medium text-xs">{t('admin.sidebar.preferences.sidebarCollapseMode')}</Label>
              <ToggleGroup
                size="sm"
                variant="outline"
                type="single"
                value={collapsible}
                onValueChange={onSidebarCollapseModeChange}
              >
                <ToggleGroupItem value="icon" aria-label={t('admin.sidebar.preferences.aria.collapseIcon')}>
                  {t('admin.sidebar.preferences.sidebarCollapsible.icon')}
                </ToggleGroupItem>
                <ToggleGroupItem value="offcanvas" aria-label={t('admin.sidebar.preferences.aria.collapseOffcanvas')}>
                  {t('admin.sidebar.preferences.sidebarCollapsible.offcanvas')}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <Button type="button" size="sm" variant="outline" className="w-full" onClick={handleRestore}>
              {t('admin.sidebar.preferences.restoreDefaults')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
