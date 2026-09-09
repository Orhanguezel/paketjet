'use client';
import Link from 'next/link';
import {Suspense} from 'react';
import {LoginForm} from '../_components/login-form';
export default function Login(){
 return <main className="grid min-h-dvh place-items-center bg-background px-5 py-12"><div className="w-full max-w-md"><Link href="https://paketjet.com" className="mb-8 flex items-center gap-3"><img src="/uploads/media/logo/logo-transparent.png" alt="PaketJet" width={52} height={52} className="size-13 object-contain"/><span className="text-xl font-semibold">PaketJet</span></Link><section className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8"><h1 className="text-2xl font-semibold tracking-tight">Yönetim paneline giriş</h1><p className="mb-7 mt-3 text-sm leading-6 text-muted-foreground">İlanları, iletişim satışlarını ve site ayarlarını yönetin.</p><Suspense fallback={<output>Giriş formu hazırlanıyor…</output>}><LoginForm/></Suspense><p className="mt-6 text-sm text-muted-foreground">Erişim desteği için <Link href="https://paketjet.com/iletisim" className="text-primary underline-offset-4 hover:underline">bize ulaşın.</Link></p></section></div></main>;
}
