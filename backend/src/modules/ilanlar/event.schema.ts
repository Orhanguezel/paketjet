import {mysqlTable,char,varchar,datetime} from 'drizzle-orm/mysql-core';
import {sql} from 'drizzle-orm';
export const listingEvents=mysqlTable('listing_events',{
 id:char('id',{length:36}).primaryKey(),ilan_id:char('ilan_id',{length:36}).notNull(),actor_id:varchar('actor_id',{length:64}).notNull(),previous_status:varchar('previous_status',{length:32}),status:varchar('status',{length:32}).notNull(),created_at:datetime('created_at',{fsp:3}).notNull().default(sql`CURRENT_TIMESTAMP(3)`),
});
