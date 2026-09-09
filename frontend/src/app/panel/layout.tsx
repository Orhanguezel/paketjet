import type { Metadata } from 'next';
import {getSiteSettingValue} from '@/lib/site-settings';
import PanelShell from './panel-shell';
export const metadata:Metadata={robots:{index:false,follow:false}};
export default async function PanelLayout({children}:{children:React.ReactNode}){const logo=await getSiteSettingValue<{url?:string;src?:string;logo_url?:string}>("site_logo","*");return <PanelShell logoUrl={logo?.url||logo?.src||logo?.logo_url}>{children}</PanelShell>;}
