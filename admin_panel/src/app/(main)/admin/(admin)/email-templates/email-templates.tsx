'use client';

import * as React from 'react';
import Link from 'next/link';
import { Pencil, RefreshCcw, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useListEmailTemplatesAdminQuery, useDeleteEmailTemplateAdminMutation } from '@/integrations/hooks';

type StatusFilter = 'all' | 'active' | 'inactive';

export default function EmailTemplatesPage() {
  const t = useAdminT('admin.emailTemplates');
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<StatusFilter>('all');

  const params = React.useMemo(
    () => ({
      search: search.trim() || undefined,
      is_active: status === 'all' ? undefined : status === 'active',
    }),
    [search, status],
  );

  const listQ = useListEmailTemplatesAdminQuery(params, { refetchOnMountOrArgChange: true });
  const [deleteTemplate, deleteState] = useDeleteEmailTemplateAdminMutation();

  const rows = listQ.data ?? [];

  async function onDelete(id: string, key: string) {
    if (!window.confirm(`${key} — ${t('list.actions.delete')}?`)) return;
    try {
      await deleteTemplate({ id }).unwrap();
      toast.success(t('list.actions.delete'));
      listQ.refetch();
    } catch {
      toast.error(t('admin.common.error'));
    }
  }

  function fmtDate(v: string | Date): string {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString('tr-TR');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('list.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('list.description')}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => listQ.refetch()} disabled={listQ.isFetching}>
          <RefreshCcw className="mr-2 size-4" />
          {t('list.refreshButton')}
        </Button>
      </div>

      <Card>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t('list.filters.searchLabel')}</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('list.filters.searchPlaceholder')}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('list.filters.statusLabel')}</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('list.filters.statusOptions.all')}</SelectItem>
                <SelectItem value="active">{t('list.filters.statusOptions.active')}</SelectItem>
                <SelectItem value="inactive">{t('list.filters.statusOptions.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-1">
          <CardTitle className="text-base">{t('list.title')}</CardTitle>
          <CardDescription>{t('list.totalRecords', { count: rows.length })}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('list.table.headers.templateKey')}</TableHead>
                <TableHead>{t('list.table.headers.nameSubject')}</TableHead>
                <TableHead>{t('list.table.headers.variables')}</TableHead>
                <TableHead>{t('list.table.headers.active')}</TableHead>
                <TableHead>{t('list.table.headers.date')}</TableHead>
                <TableHead>{t('list.table.headers.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    {listQ.isFetching ? t('list.loading') : t('list.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((tpl) => {
                  const vars = tpl.detected_variables?.length ? tpl.detected_variables : (tpl.variables ?? []);
                  return (
                    <TableRow key={tpl.id}>
                      <TableCell className="font-mono text-xs">{tpl.template_key}</TableCell>
                      <TableCell>
                        <div className="font-medium">{tpl.template_name || '-'}</div>
                        <div className="text-xs text-muted-foreground">{tpl.subject || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {vars.slice(0, 4).map((v) => (
                            <Badge key={v} variant="outline" className="font-mono text-[10px]">{v}</Badge>
                          ))}
                          {vars.length > 4 && <span className="text-xs text-muted-foreground">+{vars.length - 4}</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tpl.is_active ? 'default' : 'outline'}>
                          {tpl.is_active ? t('list.filters.statusOptions.active') : t('list.filters.statusOptions.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fmtDate(tpl.updated_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button asChild type="button" variant="outline" size="sm">
                            <Link href={`/admin/email-templates/${tpl.id}`}>
                              <Pencil className="mr-1.5 size-3.5" />
                              {t('list.actions.edit')}
                            </Link>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={deleteState.isLoading}
                            onClick={() => onDelete(tpl.id, tpl.template_key)}
                          >
                            <Trash2 className="mr-1.5 size-3.5" />
                            {t('list.actions.delete')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
