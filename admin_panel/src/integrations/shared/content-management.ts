export type ManagedResource='pages'|'faqs'|'tickets';
export interface ManagedContent {id:string;[field:string]:string|number|null;}
export const managedResourcePaths:Record<ManagedResource,string>={pages:'/admin/custom-pages',faqs:'/admin/support/faqs',tickets:'/admin/support/tickets'};
export type ManagedField={key:string;label:string;type?:'textarea'|'number'|'select';required?:boolean;max?:number;options?:[string,string][]};
export const managedFields:Record<ManagedResource,ManagedField[]>={
 pages:[{key:'title',label:'Başlık',required:true,max:500},{key:'slug',label:'URL adı',required:true,max:255},{key:'module_key',label:'İçerik grubu',required:true,max:100},{key:'locale',label:'Dil',required:true,max:10},{key:'summary',label:'Özet',type:'textarea',max:10000},{key:'content',label:'Sayfa içeriği (HTML)',type:'textarea',max:200000},{key:'meta_title',label:'Arama sonucu başlığı',max:255},{key:'meta_description',label:'Arama sonucu açıklaması',type:'textarea',max:500},{key:'featured_image',label:'Görsel adresi',max:500},{key:'display_order',label:'Sıra',type:'number'},{key:'is_published',label:'Yayın durumu',type:'select',options:[['0','Taslak'],['1','Yayında']]}],
 faqs:[{key:'question',label:'Soru',required:true,max:500},{key:'answer',label:'Yanıt',required:true,type:'textarea',max:20000},{key:'locale',label:'Dil',required:true,max:10},{key:'category',label:'Kategori',type:'select',options:[['genel','Genel'],['kargo','İlan ve güzergâh'],['odeme','Ödeme'],['hesap','Hesap'],['teknik','Teknik']]},{key:'display_order',label:'Sıra',type:'number'},{key:'is_published',label:'Yayın durumu',type:'select',options:[['0','Taslak'],['1','Yayında']]}],
 tickets:[{key:'status',label:'Durum',type:'select',options:[['open','Açık'],['in_progress','İşlemde'],['resolved','Çözüldü'],['closed','Kapalı']]},{key:'priority',label:'Öncelik',type:'select',options:[['low','Düşük'],['normal','Normal'],['high','Yüksek'],['urgent','Acil']]},{key:'admin_note',label:'İç not',type:'textarea',max:10000}],
};

export interface ContentRevision {id:string;slug:string;created_at:string;snapshot:Record<string,unknown>}
export interface ListingHistoryResult {events:{id:string;actor_id:string;previous_status:string|null;status:string;created_at:string}[];purchases:{id:string;buyer_id:string;status:string;created_at:string}[]}
