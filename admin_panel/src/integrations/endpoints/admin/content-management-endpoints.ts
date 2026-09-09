import {baseApi} from '@/integrations/base-api';
import {managedResourcePaths,type ManagedResource,type ManagedContent,type ContentRevision,type ListingHistoryResult} from '@/integrations/shared';
const contentApi=baseApi.injectEndpoints({endpoints:b=>({
 contentRevisions:b.query<ContentRevision[],string>({query:id=>`/admin/custom-pages/${encodeURIComponent(id)}/revisions`}),
 listingHistory:b.query<ListingHistoryResult,string>({query:id=>`/admin/ilanlar/${encodeURIComponent(id)}/history`}),
 managedRecord:b.query<ManagedContent,{resource:ManagedResource;id:string}>({query:({resource,id})=>`${managedResourcePaths[resource]}/${encodeURIComponent(id)}?locale=tr`}),
 managedContent:b.query<ManagedContent[],{resource:ManagedResource;offset:number;search?:string}>({query:({resource,...params})=>({url:managedResourcePaths[resource],params:{...params,limit:20,locale:'tr'}})}),
 saveManagedContent:b.mutation<ManagedContent,{resource:ManagedResource;id?:string;body:Record<string,string|number|null>}>({query:({resource,id,body})=>({url:`${managedResourcePaths[resource]}${id?`/${encodeURIComponent(id)}`:''}`,method:id?'PATCH':'POST',body})}),
 deleteManagedContent:b.mutation<{ok:boolean},{resource:ManagedResource;id:string}>({query:({resource,id})=>({url:`${managedResourcePaths[resource]}/${encodeURIComponent(id)}`,method:'DELETE'})}),
})});
export const {useContentRevisionsQuery,useListingHistoryQuery,useManagedRecordQuery,useManagedContentQuery,useSaveManagedContentMutation,useDeleteManagedContentMutation}=contentApi;
