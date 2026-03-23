"use client";
import { useState, useEffect, useCallback } from "react";
import { adminListEmailTemplates, adminUpdateEmailTemplate, type EmailTemplate } from "@/modules/admin/admin.service";
import { AdminPageHeader, AdminListSkeleton, AdminEmptyState } from "@/components/admin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AdminEmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<EmailTemplate | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setTemplates(await adminListEmailTemplates()); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openEdit(t: EmailTemplate) {
    setSelected(t);
    setEditSubject(t.subject);
    setEditBody(t.body_html);
    setPreview(false);
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      await adminUpdateEmailTemplate(selected.id, { subject: editSubject, body_html: editBody });
      await load();
      setSelected(null);
    } catch (e) { console.error(e); } finally { setSaving(false); }
  }

  return (
    <div>
      <AdminPageHeader title="E-posta Sablonlari" subtitle={`${templates.length} sablon`} />

      {loading ? <AdminListSkeleton /> : (
        <div className="flex gap-6">
          <div className={`${selected ? "w-80" : "flex-1"} shrink-0`}>
            {templates.length === 0 ? <AdminEmptyState message="Sablon bulunamadi." /> : (
              <div className="flex flex-col gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => openEdit(t)}
                    className={`text-left bg-surface rounded-xl border p-4 transition-colors ${
                      selected?.id === t.id ? "border-brand" : "border-border-soft hover:border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-foreground">{t.slug}</span>
                      <Badge color="muted">{t.locale}</Badge>
                    </div>
                    <p className="text-xs text-muted truncate">{t.subject}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <div className="flex-1 bg-surface rounded-xl border border-border-soft p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground">{selected.slug}</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setPreview(!preview)}>
                    {preview ? "Duzenle" : "Onizleme"}
                  </Button>
                  <button onClick={() => setSelected(null)} className="text-muted hover:text-foreground text-lg">&times;</button>
                </div>
              </div>

              {preview ? (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Konu: {editSubject}</p>
                  <div className="bg-white rounded-lg border border-border-soft p-4 text-sm" dangerouslySetInnerHTML={{ __html: editBody }} />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted mb-1 block">Konu</label>
                    <input type="text" value={editSubject} onChange={(e) => setEditSubject(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-bg-alt border border-border-soft rounded-lg text-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted mb-1 block">HTML Icerik</label>
                    <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={16}
                      className="w-full px-3 py-2 text-sm bg-bg-alt border border-border-soft rounded-lg text-foreground font-mono" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" loading={saving} onClick={handleSave}>Kaydet</Button>
                    <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>Iptal</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
