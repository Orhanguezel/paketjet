"use client";
import { useState, useEffect } from "react";
import { adminGetCommissionRate, adminSetCommissionRate } from "@/modules/admin/admin.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminKomisyonPage() {
  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    adminGetCommissionRate()
      .then((c) => setRate(String(c.rate)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(rate);
    if (isNaN(val) || val < 0 || val > 100) {
      setMsg("Oran 0–100 arasında olmalıdır.");
      return;
    }
    setSaving(true);
    setMsg("");
    try {
      await adminSetCommissionRate(val);
      setMsg("Komisyon oranı güncellendi.");
    } catch {
      setMsg("Güncelleme başarısız oldu.");
    } finally {
      setSaving(false);
    }
  }

  const examplePrice = 100;
  const rateNum = parseFloat(rate) || 0;
  const commission = (examplePrice * rateNum / 100).toFixed(2);
  const carrierPayout = (examplePrice - parseFloat(commission)).toFixed(2);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground mb-6">Platform Komisyonu</h1>

      <div className="bg-surface rounded-xl border border-border-soft p-6 max-w-lg">
        <p className="text-sm text-muted mb-4">
          Teslim edilen her rezervasyondan kesilecek platform komisyon oranını belirleyin.
        </p>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Komisyon Oranı (%)"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="10"
            disabled={loading}
          />

          {rateNum > 0 && (
            <div className="bg-background rounded-lg p-4 text-sm">
              <p className="font-semibold text-foreground mb-2">Örnek Hesaplama (₺{examplePrice} booking)</p>
              <div className="flex flex-col gap-1 text-muted">
                <div className="flex justify-between">
                  <span>Platform komisyonu</span>
                  <span className="font-semibold text-danger">₺{commission}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taşıyıcıya ödenen</span>
                  <span className="font-semibold text-success">₺{carrierPayout}</span>
                </div>
              </div>
            </div>
          )}

          {msg && (
            <p className={`text-xs font-medium ${msg.includes("güncellendi") ? "text-success" : "text-danger"}`}>
              {msg}
            </p>
          )}

          <Button type="submit" loading={saving} disabled={loading}>
            Kaydet
          </Button>
        </form>
      </div>
    </div>
  );
}
