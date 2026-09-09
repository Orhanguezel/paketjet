import ManagedContentPage from '../../../_components/managed-content';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <ManagedContentPage resource="pages" initialId={id}/>;}
