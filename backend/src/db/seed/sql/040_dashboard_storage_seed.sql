SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO `storage_assets`
  (`id`, `name`, `bucket`, `path`, `folder`, `mime`, `size`, `url`,
   `provider`, `provider_public_id`, `provider_resource_type`, `provider_format`)
VALUES
('00009400-0000-4000-8000-000000000201','bildirimler','icons','bildirimler.png','icons','image/png',419300,'/uploads/icons/bildirimler.png','local','icons/bildirimler.png','image','png'),
('00009400-0000-4000-8000-000000000203','cikis-yap','icons','cikis-yap.png','icons','image/png',397098,'/uploads/icons/cikis-yap.png','local','icons/cikis-yap.png','image','png'),
('00009400-0000-4000-8000-000000000204','dogrulama','icons','dogrulama.png','icons','image/png',417665,'/uploads/icons/dogrulama.png','local','icons/dogrulama.png','image','png'),
('00009400-0000-4000-8000-000000000205','ilan-alma-hakki','icons','ilan-alma-hakki.png','icons','image/png',421545,'/uploads/icons/ilan-alma-hakki.png','local','icons/ilan-alma-hakki.png','image','png'),
('00009400-0000-4000-8000-000000000206','ilanlarim','icons','ilanlarim.png','icons','image/png',384667,'/uploads/icons/ilanlarim.png','local','icons/ilanlarim.png','image','png'),
('00009400-0000-4000-8000-000000000207','profil','icons','profil.png','icons','image/png',374091,'/uploads/icons/profil.png','local','icons/profil.png','image','png'),
('00009400-0000-4000-8000-000000000208','satin-aldiklarim','icons','satin-aldiklarim.png','icons','image/png',398772,'/uploads/icons/satin-aldiklarim.png','local','icons/satin-aldiklarim.png','image','png'),
('00009400-0000-4000-8000-000000000210','tasima-kurallari','icons','tasima-kurallari.png','icons','image/png',421035,'/uploads/icons/tasima-kurallari.png','local','icons/tasima-kurallari.png','image','png'),
('00009400-0000-4000-8000-000000000211','logo-512x512-transparent','logo','logo-512x512-transparent.png','logo','image/png',178585,'/uploads/logo/logo-512x512-transparent.png','local','logo/logo-512x512-transparent.png','image','png'),
('00009400-0000-4000-8000-000000000212','logo-512x512-white','logo','logo-512x512-white.png','logo','image/png',147637,'/uploads/logo/logo-512x512-white.png','local','logo/logo-512x512-white.png','image','png'),
('00009400-0000-4000-8000-000000000213','dashboard','icons','dashboard.png','icons','image/png',418200,'/uploads/icons/dashboard.png','local','icons/dashboard.png','image','png'),
('00009400-0000-4000-8000-000000000214','ilan-ver','icons','ilan-ver.png','icons','image/png',386906,'/uploads/icons/ilan-ver.png','local','icons/ilan-ver.png','image','png'),
('00009400-0000-4000-8000-000000000215','iletisimi-gor','icons','iletisimi-gor.png','icons','image/png',432363,'/uploads/icons/iletisimi-gor.png','local','icons/iletisimi-gor.png','image','png')
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `mime` = VALUES(`mime`),
  `size` = VALUES(`size`),
  `url` = VALUES(`url`),
  `provider` = VALUES(`provider`),
  `provider_public_id` = VALUES(`provider_public_id`),
  `provider_resource_type` = VALUES(`provider_resource_type`),
  `provider_format` = VALUES(`provider_format`);
