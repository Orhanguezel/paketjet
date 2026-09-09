/** Settings are private by default. Public presentation keys require explicit approval here. */
const publicKeys=new Set([
 'app_locales','default_locale','public_base_url','auth_login_image','auth_register_image','login_brand_image',
 'site_logo','site_logo_dark','site_logo_light','site_favicon','site_apple_touch_icon','site_app_icon_512','site_og_default_image','site_meta_default','site_seo','site_title','site_version',
 'contact_info','contact_address','contact_email','contact_phone_display','contact_phone_tel','contact_whatsapp_link','businessHours','company_brand','company_profile','socials',
 'hero','hero_config','hero_video','home_backgrounds','homepage_banners','homepage_hero','homepage_hero_v2','homepage_sections',
 'footer_about','footer_copyright','footer_keywords','footer_legal_links','footer_quick_links','footer_services','header_cta_label','header_info_text','header_menu','menu_kurumsal',
 'cta_post_listing_path','cta_post_listing_subtitle','cta_post_listing_title','topbar_location','topbar_slogan','ui_header','ui_theme','ui_admin','ui_admin_config',
 'seo_app_icons','seo_defaults','seo_local_business','seo_pages','seo_social_same_as',
 'pricing.credit_packages','pricing.listing_credit_price','listing.content_declaration',
 'google_client_id','integration.google_maps.api_key','integration.google_maps.enabled','integration.google_maps.map_id',
 'gtm_container_id','ga4_measurement_id','cookie_consent',
 'brand_display_name','brand_logo','brand_logo_dark','brand_logo_icon','brand_logo_icon_192','brand_logo_icon_512','brand_logo_icon_transparent','brand_logo_text','brand_name','brand_og_image','brand_subtitle','brand_tagline',
 'social_facebook_url','social_instagram_url','social_twitter_url',
]);
export function isPublicSetting(key:string){
 const normalized=key.startsWith('paketjet__')?key.slice('paketjet__'.length):key;
 return publicKeys.has(normalized)||/^seo_pages_[a-z0-9_-]+$/.test(normalized);
}
