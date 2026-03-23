"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/modules/auth/auth.store";
import Link from "next/link";
import { getMyBookings } from "@/modules/booking/booking.service";
import { getCustomerDashboard } from "@/modules/dashboard/dashboard.service";
import { getBookingRating } from "@/modules/rating/rating.service";
import type { Booking } from "@/modules/booking/booking.type";
import type { CustomerDashboard } from "@/modules/dashboard/dashboard.service";
import BookingList from "./_components/BookingList";
import { CustomerDashboardOverview } from "@/modules/dashboard/components/CustomerDashboardHeader";

export default function MusteriPage() {
  const { user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [dashboard, setDashboard] = useState<CustomerDashboard | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratedBookings, setRatedBookings] = useState<Set<string>>(new Set());

  useEffect(() => {
    setHydrated(true);
  }, []);

  const allowed = user?.role === "customer" || user?.role === "admin";

  useEffect(() => {
    if (!hydrated || !allowed) return;
    Promise.all([getCustomerDashboard(), getMyBookings()])
      .then(async ([dash, list]) => {
        setDashboard(dash);
        setBookings(list.data);
        const deliveredIds = list.data.filter((b) => b.status === "delivered").map((b) => b.id);
        const checks = await Promise.allSettled(deliveredIds.map((id) => getBookingRating(id)));
        const alreadyRated = new Set<string>();
        checks.forEach((r, i) => {
          if (r.status === "fulfilled" && r.value !== null) alreadyRated.add(deliveredIds[i]);
        });
        setRatedBookings(alreadyRated);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [hydrated, allowed]);

  if (!hydrated) {
    return <div className="text-muted text-sm text-center py-12">Yükleniyor...</div>;
  }

  if (!allowed) {
    return <div className="text-danger font-bold text-center py-12">Bu sayfaya erişim yetkiniz yok.</div>;
  }

  function handleRated(bookingId: string) {
    setRatedBookings((prev) => new Set(prev).add(bookingId));
  }

  function handleDashboardUpdate() {
    setDashboard((prev) =>
      prev ? { ...prev, active_bookings: Math.max(0, (prev.active_bookings ?? 1) - 1) } : prev
    );
  }

  return (
    <div>
      <CustomerDashboardOverview />

      <div className="flex items-center justify-between mt-8 mb-6">
        <h2 className="text-xl font-extrabold text-foreground">Gönderilerim</h2>
      </div>

      <div className="bg-surface rounded-xl border border-border-soft p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Taşıma Kuralları</p>
          <p className="text-xs text-muted">Yasaklı maddeler, paketleme kuralları ve sorumluluklar</p>
        </div>
        <Link href="/tasima-kurallari" className="text-sm text-brand font-semibold hover:underline whitespace-nowrap">
          Oku →
        </Link>
      </div>

      <BookingList
        bookings={bookings}
        setBookings={setBookings}
        ratedBookings={ratedBookings}
        onRated={handleRated}
        loading={loading}
        onDashboardUpdate={handleDashboardUpdate}
      />
    </div>
  );
}
