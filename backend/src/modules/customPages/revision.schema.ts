import {mysqlTable,char,varchar,json,datetime} from 'drizzle-orm/mysql-core';
import {sql} from 'drizzle-orm';
export const contentRevisions=mysqlTable('content_revisions',{
 id:char('id',{length:64}).primaryKey(),page_id:char('page_id',{length:36}).notNull(),slug:varchar('slug',{length:500}).notNull(),locale:varchar('locale',{length:10}).notNull(),snapshot:json('snapshot').notNull(),created_at:datetime('created_at',{fsp:3}).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
});
