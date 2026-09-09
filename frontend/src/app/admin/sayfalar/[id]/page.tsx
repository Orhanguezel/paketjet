import {redirect} from 'next/navigation';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;redirect('https://panel.paketjet.com/admin/pages/'+encodeURIComponent(id));}
