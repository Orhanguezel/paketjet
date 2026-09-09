import {notFound} from 'next/navigation';
import UiPreview from './preview-client';
export const metadata={robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default function Page(){if(process.env.NODE_ENV==='production')notFound();return <UiPreview/>;}
