'use client';

import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useGetDashboardActivityAdminQuery } from '@/integrations/hooks';
import { Card } from '@/components/ui/card';

type DayRow = { day: string; count: number | string };

function rows(value: unknown): DayRow[] {
  const source = Array.isArray(value) && Array.isArray(value[0]) ? value[0] : value;
  return Array.isArray(source) ? source.filter((row): row is DayRow =>
    !!row && typeof row.day === 'string' && Number.isFinite(Number(row.count))) : [];
}

function dateKey(offset: number): string {
  const day = new Date();
  day.setUTCHours(0, 0, 0, 0);
  day.setUTCDate(day.getUTCDate() - offset);
  return day.toISOString().slice(0, 10);
}

export function DashboardActivity() {
  const [days, setDays] = useState<7 | 30>(30);
  const query = useGetDashboardActivityAdminQuery();
  const data = useMemo(() => {
    const ilanlar = new Map(rows(query.data?.daily?.ilanlar).map((row) => [row.day.slice(0, 10), Number(row.count)]));
    const users = new Map(rows(query.data?.daily?.users).map((row) => [row.day.slice(0, 10), Number(row.count)]));
    return Array.from({ length: days }, (_, index) => {
      const day = dateKey(days - index - 1);
      return { day, ilanlar: ilanlar.get(day) ?? 0, users: users.get(day) ?? 0 };
    });
  }, [query.data, days]);

  return <Card className="admin-dashboard-panel admin-activity-panel">
    <div className="admin-panel-heading">
      <div><h2>Platform aktivitesi</h2><p>Günlük ilan ve yeni üye sayıları · örnek ilanlar dahil</p></div>
      <select aria-label="Grafik dönemi" value={days} onChange={(event) => setDays(Number(event.target.value) as 7 | 30)} className="admin-period-select">
        <option value={7}>Son 7 gün</option><option value={30}>Son 30 gün</option>
      </select>
    </div>
    <div className="admin-chart-legend"><span><i className="admin-legend-dot admin-legend-primary" />Yeni ilanlar</span><span><i className="admin-legend-dot admin-legend-secondary" />Yeni üyeler</span></div>
    {query.isError ? <p role="alert" className="admin-panel-message">Aktivite verileri yüklenemedi.</p> : query.isLoading ? <div className="admin-chart-loading">Grafik yükleniyor…</div> : <div className="admin-chart-wrap" role="img" aria-label={`Son ${days} günün ilan ve yeni üye sayısı grafiği`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 8, left: -24, bottom: 0 }}>
          <defs><linearGradient id="admin-listings-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5c36dc" stopOpacity={0.18} /><stop offset="100%" stopColor="#5c36dc" stopOpacity={0.01} /></linearGradient></defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} minTickGap={28} tickFormatter={(day: string) => new Date(`${day}T00:00:00Z`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', timeZone: 'UTC' })} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
          <Tooltip labelFormatter={(day) => new Date(`${day}T00:00:00Z`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: 'UTC' })} formatter={(value, name) => [value, name === 'ilanlar' ? 'Yeni ilanlar' : 'Yeni üyeler']} />
          <Area dataKey="ilanlar" type="monotone" stroke="#5930d6" strokeWidth={2.4} fill="url(#admin-listings-fill)" />
          <Area dataKey="users" type="monotone" stroke="#ad99fa" strokeWidth={2} fill="transparent" />
        </AreaChart>
      </ResponsiveContainer>
    </div>}
  </Card>;
}
