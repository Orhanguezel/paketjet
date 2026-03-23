"use client";
import { useState, useEffect, useCallback } from "react";
import {
  adminListTelegramInbound, adminGetAutoreply, adminSetAutoreply, adminSendTelegramTest,
  type TelegramInbound,
} from "@/modules/admin/admin.service";
import { AdminPageHeader, AdminListSkeleton, AdminEmptyState, AdminPagination } from "@/components/admin";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

const LIMIT = 20;

export default function AdminTelegramPage() {
  const [tab, setTab] = useState<"inbound" | "settings">("inbound");
  const [messages, setMessages] = useState<TelegramInbound[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [arEnabled, setArEnabled] = useState(false);
  const [arText, setArText] = useState("");
  const [arSaving, setArSaving] = useState(false);
  const [testText, setTestText] = useState("");
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const loadMessages = useCallback(async (p: number) => {
    setLoading(true);
    try { setMessages(await adminListTelegramInbound({ page: p, limit: LIMIT })); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const ar = await adminGetAutoreply();
      setArEnabled(ar.enabled);
      setArText(ar.text);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    if (tab === "inbound") loadMessages(page);
    else loadSettings();
  }, [tab, page, loadMessages, loadSettings]);

  async function saveAutoreply() {
    setArSaving(true);
    try { await adminSetAutoreply({ enabled: arEnabled, text: arText }); }
    catch (e) { console.error(e); } finally { setArSaving(false); }
  }

  async function sendTest() {
    if (!testText.trim()) return;
    setTestSending(true);
    setTestResult(null);
    try {
      await adminSendTelegramTest(testText);
      setTestResult("Gonderildi!");
      setTestText("");
    } catch (e) { setTestResult("Hata olustu."); console.error(e); } finally { setTestSending(false); }
  }

  const TABS = [
    { key: "inbound" as const, label: "Gelen Mesajlar" },
    { key: "settings" as const, label: "Ayarlar" },
  ];

  return (
    <div>
      <AdminPageHeader title="Telegram" />

      <div className="flex items-center gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-brand text-white" : "bg-bg-alt text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "inbound" && (
        <>
          {loading ? <AdminListSkeleton /> : messages.length === 0 ? <AdminEmptyState message="Gelen mesaj yok." /> : (
            <div className="flex flex-col gap-2">
              {messages.map((m) => (
                <div key={m.id} className="bg-surface rounded-xl border border-border-soft p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-foreground">
                      {m.from_username ? `@${m.from_username}` : `Chat ${m.chat_id}`}
                    </span>
                    <span className="text-xs text-faint">{formatDate(m.created_at)}</span>
                  </div>
                  <p className="text-sm text-muted">{m.text}</p>
                </div>
              ))}
            </div>
          )}
          <AdminPagination page={page} totalPages={Math.ceil(messages.length / LIMIT)} onPageChange={setPage} />
        </>
      )}

      {tab === "settings" && (
        <div className="max-w-lg flex flex-col gap-6">
          <div className="bg-surface rounded-xl border border-border-soft p-5">
            <h3 className="font-semibold text-foreground mb-3">Otomatik Yanit</h3>
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={arEnabled} onChange={(e) => setArEnabled(e.target.checked)}
                className="w-4 h-4 accent-brand" />
              <span className="text-sm text-foreground">Aktif</span>
            </label>
            <textarea value={arText} onChange={(e) => setArText(e.target.value)} rows={4} placeholder="Otomatik yanit metni..."
              className="w-full px-3 py-2 text-sm bg-bg-alt border border-border-soft rounded-lg text-foreground mb-3" />
            <Button size="sm" loading={arSaving} onClick={saveAutoreply}>Kaydet</Button>
          </div>

          <div className="bg-surface rounded-xl border border-border-soft p-5">
            <h3 className="font-semibold text-foreground mb-3">Test Mesaji Gonder</h3>
            <input type="text" value={testText} onChange={(e) => setTestText(e.target.value)} placeholder="Test mesaji..."
              className="w-full px-3 py-2 text-sm bg-bg-alt border border-border-soft rounded-lg text-foreground mb-3" />
            <div className="flex items-center gap-3">
              <Button size="sm" variant="secondary" loading={testSending} onClick={sendTest}>Gonder</Button>
              {testResult && <span className="text-sm text-muted">{testResult}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
