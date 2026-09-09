import {it,expect} from 'bun:test';
import {randomUUID} from 'node:crypto';
import {repoCreateCustomPage,repoUpdateCustomPage,repoDeleteCustomPage,repoGetCustomPageById} from '@/modules/customPages/repository';
import {repoContentRevisions,repoPreserveContent} from '@/modules/customPages/revision.repository';
import {normalizeValueByKey} from '@/modules/siteSettings/settingPolicy';
it('content edits and deletion preserve the accepted immutable text',async()=>{
 const {id}=await repoCreateCustomPage({title:'Version test',slug:`revision-${randomUUID()}`,locale:'tr',module_key:'legal',content:'Original accepted text',is_published:true});
 const original=(await repoGetCustomPageById(id))!;
 const accepted=await repoPreserveContent(original);
 await repoUpdateCustomPage(id,{locale:'tr',content:'New published text'});
 const revisions=await repoContentRevisions(id);
 expect(revisions.some(r=>`${r.slug}@${r.id}`===accepted)).toBe(true);
 expect(JSON.stringify(revisions)).toContain('Original accepted text');
 await repoDeleteCustomPage(id);
 expect(JSON.stringify(await repoContentRevisions(id))).toContain('New published text');
});
it('admin prices reject free, fractional credits, duplicate package ids and sub-cent amounts',()=>{
 for(const price of [0,-1,1.001,'bad'])expect(()=>normalizeValueByKey('pricing.listing_credit_price',price)).toThrow();
 for(const credits of [0,-1,1.5])expect(()=>normalizeValueByKey('pricing.credit_packages',[{key:'x',credits,price:50}])).toThrow();
 expect(()=>normalizeValueByKey('pricing.credit_packages',[{key:'x',credits:1,price:50},{key:'x',credits:2,price:100}])).toThrow();
 expect(normalizeValueByKey('pricing.listing_credit_price',50.25)).toBe(50.25);
});
