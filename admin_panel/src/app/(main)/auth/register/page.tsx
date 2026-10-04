import { PUBLIC_SITE_URL } from '@/lib/app-brand';
import {redirect} from 'next/navigation';
export default function LegacyAuthPage(){redirect(PUBLIC_SITE_URL ? `${PUBLIC_SITE_URL}/uye-ol` : '/auth/login');}
