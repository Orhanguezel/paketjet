'use client';

import Link from 'next/link';
import { Suspense } from 'react';

import { AuthBrandPanel } from '../../_components/auth-brand-panel';
import { LoginForm } from '../../_components/login-form';

function LoginFormFallback() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
    </div>
  );
}

export default function SellerLoginPage() {
  return (
    <div className="flex min-h-dvh">
      <AuthBrandPanel
        title="Satici Girisi"
        subtitle="Magazanizi ve kampanyalarinizi yonetin"
      />

      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="font-medium tracking-tight">Satici Hesabina Giris</div>
            <div className="mx-auto max-w-xl text-muted-foreground">Bu alan sadece satici hesaplari icindir.</div>
          </div>

          <div className="space-y-4">
            <Suspense fallback={<LoginFormFallback />}>
              <LoginForm mode="seller" fallbackNext="/admin/dashboard" />
            </Suspense>

            <p className="text-center text-muted-foreground text-xs">
              Hesabin yok mu?{' '}
              <Link prefetch={false} href="/auth/seller/register" className="text-primary underline-offset-4 hover:underline">
                Satici kaydi olustur
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
