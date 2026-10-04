import {redirectToAdmin} from '@/lib/admin-url';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;redirectToAdmin('/admin/support/'+encodeURIComponent(id));}
