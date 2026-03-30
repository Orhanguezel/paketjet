'use client';

import Link from 'next/link';
import { Suspense } from 'react';

import { AuthBrandPanel } from '../../_components/auth-brand-panel';
import { RegisterForm } from '../../_components/register-form';

function RegisterFormFallback() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
    </div>
  );
}

export default function SellerRegisterPage() {
  return (
    <div className="flex min-h-dvh">
      <AuthBrandPanel
        title="Satici Kaydi"
        subtitle="Satici hesabinizi olusturup panele girin"
      />

      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="font-medium tracking-tight">Satici Hesabi Olustur</div>
            <div className="mx-auto max-w-xl text-muted-foreground">Kayit sonrasi hesabiniza seller rolu atanir.</div>
          </div>

          <div className="space-y-4">
            <Suspense fallback={<RegisterFormFallback />}>
              <RegisterForm mode="seller" fallbackNext="/admin/dashboard" />
            </Suspense>

            <p className="text-center text-muted-foreground text-xs">
              Zaten hesabin var mi?{' '}
              <Link prefetch={false} href="/auth/seller/login" className="text-primary underline-offset-4 hover:underline">
                Satici girisine don
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
