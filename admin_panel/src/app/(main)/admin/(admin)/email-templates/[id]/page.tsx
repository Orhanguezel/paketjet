'use client';

import * as React from 'react';
import { use as usePromise } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  useGetEmailTemplateAdminQuery,
  useUpdateEmailTemplateAdminMutation,
} from '@/integrations/hooks';

export default function EmailTemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const t = useAdminT('admin.emailTemplates');
  const router = useRouter();

  const detailQ = useGetEmailTemplateAdminQuery({ id });
  const [update, updateState] = useUpdateEmailTemplateAdminMutation();

  const [locale, setLocale] = React.useState('tr');
  const [isActive, setIsActive] = React.useState(true);
  const [name, setName] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [content, setContent] = React.useState('');
  const [loaded, setLoaded] = React.useState(false);

  // Yüklenince formu doldur (varsayılan: tr çevirisi ya da ilk çeviri)
  React.useEffect(() => {
    const d = detailQ.data;
    if (!d || loaded) return;
    const translations = d.translations ?? [];
    const tr = translations.find((x) => x.locale === 'tr') ?? translations[0];
    setIsActive(d.is_active);
    setLocale(tr?.locale ?? 'tr');
    setName(tr?.template_name ?? '');
    setSubject(tr?.subject ?? '');
    setContent(tr?.content ?? '');
    setLoaded(true);
  }, [detailQ.data, loaded]);

  async function onSave() {
    if (!name.trim()) return toast.error(t('detail.validation.templateNameRequired'));
    if (!subject.trim()) return toast.error(t('detail.validation.subjectRequired'));
    if (!content.trim()) return toast.error(t('detail.validation.contentRequired'));
    try {
      await update({
        id,
        body: { locale, template_name: name, subject, content, is_active: isActive },
      }).unwrap();
      toast.success(t('detail.toast.updated'));
      router.push('/admin/email-templates');
    } catch {
      toast.error(t('admin.common.error'));
    }
  }

  if (detailQ.isLoading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">{t('list.loading')}</div>;
  }
  if (detailQ.error || !detailQ.data) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">{t('detail.loadError')}</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/email-templates"><ArrowLeft className="mr-2 size-4" />{t('detail.backToList')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">{t('detail.titleEdit')}</h1>
          <p className="text-sm text-muted-foreground">{t('detail.descriptionEdit')}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/email-templates"><ArrowLeft className="mr-2 size-4" />{t('detail.actions.back')}</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-1">
          <CardTitle className="text-base">{t('detail.sections.generalInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t('detail.fields.templateKeyLabel')}</Label>
            <Input value={detailQ.data.template_key} readOnly className="font-mono" />
            <p className="text-xs text-muted-foreground">{t('detail.fields.templateKeyHelp')}</p>
          </div>
          <div className="flex items-center gap-3 pt-7">
            <Switch checked={isActive} onCheckedChange={setIsActive} id="tpl-active" />
            <Label htmlFor="tpl-active">{t('detail.fields.statusLabel')}</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-1">
          <CardTitle className="text-base">{t('detail.sections.templateInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label>{t('detail.fields.templateNameLabel')}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('detail.fields.templateNamePlaceholder')} />
          </div>
          <div className="space-y-2">
            <Label>{t('detail.fields.subjectLabel')}</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t('detail.fields.subjectPlaceholder')} />
            <p className="text-xs text-muted-foreground">{t('detail.fields.subjectHelp')}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-1">
          <CardTitle className="text-base">{t('detail.sections.content')}</CardTitle>
          <CardDescription>{t('detail.sections.contentDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('detail.fields.contentPlaceholder')}
            className="min-h-[260px] font-mono text-xs"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button asChild variant="outline">
          <Link href="/admin/email-templates">{t('detail.actions.cancel')}</Link>
        </Button>
        <Button onClick={onSave} disabled={updateState.isLoading}>
          {updateState.isLoading ? t('detail.actions.saving') : t('detail.actions.save')}
        </Button>
      </div>
    </div>
  );
}
