CREATE TABLE IF NOT EXISTS content_revisions (
 id CHAR(64) PRIMARY KEY,
 page_id CHAR(36) NOT NULL,
 slug VARCHAR(500) NOT NULL,
 locale VARCHAR(10) NOT NULL,
 snapshot JSON NOT NULL,
 created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
 INDEX content_revision_page(page_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Preserve current text before any renewal copy edits. Existing consent timestamps are retained in snapshot.
INSERT IGNORE INTO content_revisions (id,page_id,slug,locale,snapshot)
SELECT SHA2(CONCAT(i.page_id,':',i.locale,':',COALESCE(i.content,''),':',p.updated_at),256),i.page_id,i.slug,i.locale,
 JSON_OBJECT('title',i.title,'slug',i.slug,'locale',i.locale,'content',i.content,'summary',i.summary,'updated_at',p.updated_at,'is_published',p.is_published)
FROM custom_pages_i18n i JOIN custom_pages p ON p.id=i.page_id;
