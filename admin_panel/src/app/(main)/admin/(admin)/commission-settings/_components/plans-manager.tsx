'use client';

import * as React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import type { PlanDto, CreatePlanBody, UpdatePlanBody } from '@/integrations/shared';
import {
  useListPlansAdminQuery,
  useCreatePlanAdminMutation,
  useUpdatePlanAdminMutation,
  useDeletePlanAdminMutation,
} from '@/integrations/hooks';
import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';

function emptyForm(): CreatePlanBody {
  return {
    name: '',
    slug: '',
    price: 0,
    ilan_limit: 1,
    commission_rate: null,
    duration_days: 30,
    features: [],
    sort_order: 0,
    is_active: 1,
  };
}

export default function PlansManager() {
  const t = useAdminT('admin.commission-settings.plans');

  const plansQ = useListPlansAdminQuery();
  const [createPlan, createState] = useCreatePlanAdminMutation();
  const [updatePlan, updateState] = useUpdatePlanAdminMutation();
  const [deletePlan, deleteState] = useDeletePlanAdminMutation();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<CreatePlanBody>(emptyForm());
  const [featuresText, setFeaturesText] = React.useState('');

  const busy = createState.isLoading || updateState.isLoading || deleteState.isLoading;

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setFeaturesText('');
    setDialogOpen(true);
  }

  function openEdit(plan: PlanDto) {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      slug: plan.slug,
      price: parseFloat(plan.price),
      ilan_limit: plan.ilan_limit,
      commission_rate: plan.commission_rate != null ? parseFloat(plan.commission_rate) : null,
      duration_days: plan.duration_days,
      features: plan.features ?? [],
      sort_order: plan.sort_order,
      is_active: plan.is_active,
    });
    setFeaturesText((plan.features ?? []).join('\n'));
    setDialogOpen(true);
  }

  async function handleSave() {
    const features = featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const data = { ...form, features };

    try {
      if (editingId) {
        await updatePlan({ id: editingId, ...data } as UpdatePlanBody).unwrap();
        toast.success(t('form.updated'));
      } else {
        await createPlan(data).unwrap();
        toast.success(t('form.created'));
      }
      setDialogOpen(false);
    } catch {
      toast.error(t('errorFallback'));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('form.deleteConfirm'))) return;
    try {
      await deletePlan({ id }).unwrap();
      toast.success(t('form.deleted'));
    } catch {
      toast.error(t('errorFallback'));
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </div>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-1 size-4" />
            {t('addButton')}
          </Button>
        </CardHeader>
        <CardContent>
          {plansQ.isError ? (
            <div className="rounded-md border p-4 text-sm">
              {t('loadError')}{' '}
              <Button variant="link" className="px-1" onClick={() => plansQ.refetch()}>
                {t('retryButton')}
              </Button>
            </div>
          ) : null}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table.name')}</TableHead>
                  <TableHead>{t('table.price')}</TableHead>
                  <TableHead>{t('table.ilanLimit')}</TableHead>
                  <TableHead>{t('table.commissionRate')}</TableHead>
                  <TableHead>{t('table.duration')}</TableHead>
                  <TableHead>{t('table.status')}</TableHead>
                  <TableHead className="text-right">{t('table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(plansQ.data ?? []).map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>₺{plan.price}</TableCell>
                    <TableCell>
                      {plan.ilan_limit === 0 ? t('table.unlimited') : plan.ilan_limit}
                    </TableCell>
                    <TableCell>
                      {plan.commission_rate != null ? `%${plan.commission_rate}` : '—'}
                    </TableCell>
                    <TableCell>{plan.duration_days}</TableCell>
                    <TableCell>
                      <Badge variant={plan.is_active ? 'secondary' : 'destructive'}>
                        {plan.is_active ? t('table.active') : t('table.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(plan)}
                        >
                          <Pencil className="mr-1 size-3" />
                          {t('table.editButton')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(plan.id)}
                          disabled={busy}
                        >
                          <Trash2 className="size-3 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!plansQ.isFetching && (plansQ.data ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      {t('noRecords')}
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Plan Oluştur / Düzenle Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? t('form.editTitle') : t('form.createTitle')}
            </DialogTitle>
            <DialogDescription>
              {editingId ? t('form.editTitle') : t('form.createTitle')}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('form.nameLabel')}</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t('form.namePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('form.slugLabel')}</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder={t('form.slugPlaceholder')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('form.priceLabel')}</Label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  placeholder={t('form.pricePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('form.ilanLimitLabel')}</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.ilan_limit}
                  onChange={(e) => setForm({ ...form, ilan_limit: Number(e.target.value) })}
                  placeholder={t('form.ilanLimitPlaceholder')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('form.commissionRateLabel')}</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={form.commission_rate ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({
                      ...form,
                      commission_rate: val === '' ? null : Number(val),
                    });
                  }}
                  placeholder={t('form.commissionRatePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('form.durationLabel')}</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.duration_days}
                  onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('form.featuresLabel')}</Label>
              <Textarea
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder={t('form.featuresPlaceholder')}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('form.sortOrderLabel')}</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={form.is_active === 1}
                  onCheckedChange={(v) => setForm({ ...form, is_active: v ? 1 : 0 })}
                />
                <Label>{t('form.isActiveLabel')}</Label>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('form.cancelButton')}
            </Button>
            <Button onClick={handleSave} disabled={busy}>
              {t('form.saveButton')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
