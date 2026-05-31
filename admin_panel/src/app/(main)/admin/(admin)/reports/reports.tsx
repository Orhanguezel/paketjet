'use client';

import * as React from 'react';
import { RefreshCcw } from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { ReportRole } from '@/integrations/shared';
import {
  useAdminReportsKpiQuery,
  useAdminReportsUsersPerformanceQuery,
  useAdminReportsLocationsQuery,
} from '@/integrations/hooks';

function pct(rate: number): string {
  return `${Math.round((rate ?? 0) * 100)}%`;
}

export default function ReportsPage() {
  const t = useAdminT('admin.reports');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [role, setRole] = React.useState<ReportRole>('carrier');

  // Uygulanan filtre (Uygula'ya basınca güncellenir)
  const [applied, setApplied] = React.useState<{ from?: string; to?: string }>({});

  const rangeParams = React.useMemo(
    () => ({ from: applied.from || undefined, to: applied.to || undefined }),
    [applied],
  );

  const kpiQ = useAdminReportsKpiQuery(rangeParams);
  const usersQ = useAdminReportsUsersPerformanceQuery({ ...rangeParams, role });
  const locationsQ = useAdminReportsLocationsQuery(rangeParams);

  const kpi = kpiQ.data ?? [];
  const users = usersQ.data ?? [];
  const locations = locationsQ.data ?? [];

  function apply() {
    setApplied({ from, to });
  }
  function reset() {
    setFrom('');
    setTo('');
    setApplied({});
  }
  function refreshAll() {
    kpiQ.refetch();
    usersQ.refetch();
    locationsQ.refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={refreshAll}>
          <RefreshCcw className="mr-2 size-4" />
          {t('refresh')}
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-base">{t('filter.title')}</CardTitle>
          <CardDescription>{t('filter.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>{t('filter.from')}</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('filter.to')}</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t('filter.role')}</Label>
            <Select value={role} onValueChange={(v) => setRole(v as ReportRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carrier">carrier</SelectItem>
                <SelectItem value="customer">customer</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t('filter.roleHint')}</p>
          </div>
          <div className="flex items-end gap-2">
            <Button type="button" onClick={apply}>{t('filter.apply')}</Button>
            <Button type="button" variant="outline" onClick={reset}>{t('filter.reset')}</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="kpi">
        <TabsList>
          <TabsTrigger value="kpi">{t('tabs.kpi')}</TabsTrigger>
          <TabsTrigger value="users">{t('tabs.users')}</TabsTrigger>
          <TabsTrigger value="locations">{t('tabs.locations')}</TabsTrigger>
        </TabsList>

        {/* KPI */}
        <TabsContent value="kpi" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('kpi.bucket')}</TableHead>
                    <TableHead>{t('kpi.total')}</TableHead>
                    <TableHead>{t('kpi.completed')}</TableHead>
                    <TableHead>{t('kpi.success')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpi.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                        {kpiQ.error ? t('kpi.loadingError') : t('kpi.noData')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    kpi.map((r, i) => (
                      <TableRow key={`${r.bucket}-${i}`}>
                        <TableCell>{r.bucket}</TableCell>
                        <TableCell>{r.bookings_total}</TableCell>
                        <TableCell>{r.delivered_bookings}</TableCell>
                        <TableCell><Badge variant="secondary">{pct(r.success_rate)}</Badge></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kaynaklar */}
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader className="gap-1">
              <CardTitle className="text-base">{t('users.title')}</CardTitle>
              <CardDescription>{t('users.description', { role, count: users.length })}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('users.table.user')}</TableHead>
                    <TableHead>{t('users.table.total')}</TableHead>
                    <TableHead>{t('users.table.completed')}</TableHead>
                    <TableHead>{t('users.table.cancelled')}</TableHead>
                    <TableHead>{t('users.table.success')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                        {usersQ.error ? t('users.loadingError') : t('users.noData')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((r, i) => (
                      <TableRow key={r.user_id ?? `row-${i}`}>
                        <TableCell>
                          <div className="font-medium">{r.full_name || '-'}</div>
                          <div className="text-xs text-muted-foreground">{r.email || (r.user_id ? r.user_id.slice(0, 8) : '-')}</div>
                        </TableCell>
                        <TableCell>{r.bookings_total}</TableCell>
                        <TableCell>{r.delivered_bookings}</TableCell>
                        <TableCell>{r.cancelled_bookings}</TableCell>
                        <TableCell><Badge variant="secondary">{pct(r.success_rate)}</Badge></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lokasyonlar */}
        <TabsContent value="locations" className="mt-4">
          <Card>
            <CardHeader className="gap-1">
              <CardTitle className="text-base">{t('locations.title')}</CardTitle>
              <CardDescription>{t('locations.description', { count: locations.length })}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('locations.table.city')}</TableHead>
                    <TableHead>{t('locations.table.total')}</TableHead>
                    <TableHead>{t('locations.table.completed')}</TableHead>
                    <TableHead>{t('locations.table.cancelled')}</TableHead>
                    <TableHead>{t('locations.table.success')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                        {locationsQ.error ? t('locations.loadingError') : t('locations.noData')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    locations.map((r, i) => (
                      <TableRow key={`${r.from_city}-${r.to_city}-${i}`}>
                        <TableCell>{r.from_city} → {r.to_city}</TableCell>
                        <TableCell>{r.bookings_total}</TableCell>
                        <TableCell>{r.delivered_bookings}</TableCell>
                        <TableCell>{r.cancelled_bookings}</TableCell>
                        <TableCell><Badge variant="secondary">{pct(r.success_rate)}</Badge></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
