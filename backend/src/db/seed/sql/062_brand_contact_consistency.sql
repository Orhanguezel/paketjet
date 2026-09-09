-- Known seed identity is not verified company data. Only those literal defaults are removed.
UPDATE site_settings SET value=JSON_REMOVE(value,'$.company_name','$.phone','$.phone_2','$.address','$.city','$.working_hours','$.maps_embed_url','$.maps_lat','$.maps_lng')
WHERE `key` IN ('contact_info','paketjet__contact_info') AND JSON_VALID(value) AND JSON_UNQUOTE(JSON_EXTRACT(value,'$.phone'))='+90 312 000 00 00';
UPDATE site_settings SET value=JSON_SET(value,'$.company_name','PaketJet','$.slogan','Taşıyıcıyla doğrudan iletişim','$.about','Taşıyıcılar ücretsiz güzergâh ilanı verir. Göndericiler uygun ilanın iletişim bilgilerine erişerek taşıma koşullarını doğrudan görüşür.')
WHERE `key` IN ('company_profile','paketjet__company_profile') AND JSON_VALID(value) AND JSON_UNQUOTE(JSON_EXTRACT(value,'$.company_name'))='PaketJet Teknoloji A.Ş.';
UPDATE site_settings SET value=JSON_SET(value,'$.branding.logo','/uploads/media/logo/logo-transparent.png','$.branding.logo_icon','/uploads/media/logo/logo-transparent.png') WHERE `key` IN ('ui_admin_config','paketjet__ui_admin_config') AND JSON_VALID(value);
