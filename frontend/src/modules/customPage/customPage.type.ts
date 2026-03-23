export interface CustomPage {
  id: string;
  module_key: string;
  is_published: number;
  display_order: number;
  featured_image?: string | null;
  storage_asset_id?: string | null;
  locale: string;
  title: string;
  slug: string;
  content?: string | null;
  summary?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomPageListParams {
  locale?: string;
  module_key?: string;
  is_published?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface AdminReorderItem {
  id: string;
  display_order: number;
}
