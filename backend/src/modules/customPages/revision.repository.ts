import {createHash} from 'node:crypto';
import {eq,desc} from 'drizzle-orm';
import {contentRevisions} from './revision.schema';
import {db} from '@/db/client';
type Tx=Parameters<Parameters<typeof db.transaction>[0]>[0];
export async function repoPreserveContent(row:{id:string;slug:string;locale:string;[key:string]:unknown},executor:Tx|typeof db=db){
 const snapshot=JSON.parse(JSON.stringify(row));
 const id=createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
 await executor.insert(contentRevisions).values({id,page_id:row.id,slug:row.slug,locale:row.locale,snapshot}).onDuplicateKeyUpdate({set:{id}});
 return `${row.slug}@${id}`;
}
export async function repoContentRevisions(pageId:string){
 return db.select().from(contentRevisions).where(eq(contentRevisions.page_id,pageId)).orderBy(desc(contentRevisions.created_at)).limit(100);
}
