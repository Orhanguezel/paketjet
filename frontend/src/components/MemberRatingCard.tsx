'use client';
import { APP_NAME } from "@/lib/app-name";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { getMemberRatings } from '@/modules/rating/member-rating.service';
import type { MemberRatingsResponse } from '@/modules/rating/member-rating.type';

export function MemberRatingCard({ memberId, memberName }: { memberId: string; memberName?: string | null }) {
  const [rating, setRating] = useState<MemberRatingsResponse | null>(null);
  useEffect(() => { let active = true; getMemberRatings(memberId).then(value => { if (active) setRating(value); }).catch(() => {}); return () => { active = false; }; }, [memberId]);
  return <section className="mt-7 rounded-lg border border-border bg-surface p-5" aria-label="Üye değerlendirmesi">
    <p className="text-sm text-muted">İlan sahibi</p>
    <Link href={ROUTES.static.uye(memberId)} className="mt-1 inline-block font-semibold text-brand underline">{memberName || rating?.member_name || (APP_NAME ? `${APP_NAME} üyesi` : 'Üye')}</Link>
    <p className="mt-2 flex items-center gap-2 text-sm"><Star size={17} className="text-brand" aria-hidden="true"/>{rating ? rating.total ? `${rating.average?.toFixed(1)} / 5 · ${rating.total} doğrulanmış değerlendirme` : 'Henüz değerlendirme yok' : 'Değerlendirme yükleniyor…'}</p>
  </section>;
}
