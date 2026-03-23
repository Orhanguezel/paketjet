"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getPlans, getMySubscription, purchasePlan, cancelSubscription } from "@/modules/subscription/subscription.service";
import { getWallet, initiateDeposit } from "@/modules/wallet/wallet.service";
import type { Plan, MySubscriptionResponse } from "@/modules/subscription/subscription.type";
import type { Wallet } from "@/modules/wallet/wallet.type";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import PaymentModal from "@/components/PaymentModal";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

export default function AbonelikTab() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [mySub, setMySub] = useState<MySubscriptionResponse | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Odeme yontemi dialog
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Iyzico modal
  const [showPayment, setShowPayment] = useState(false);
  const [paymentContent, setPaymentContent] = useState("");
  const [paymentIframeUrl, setPaymentIframeUrl] = useState("");
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([getPlans(), getMySubscription(), getWallet()])
      .then(([p, s, w]) => { setPlans(p); setMySub(s); setWallet(w); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  // Iyzico odeme sonrasi: bakiye yuklendi, simdi plani satin al
  const balanceBeforeRef = useRef<number | null>(null);
  useEffect(() => {
    if (!showPayment && pendingPlanId) {
      // Modal kapandi — bakiye yuklenmis mi kontrol et
      const tryPurchase = async () => {
        setPurchasing(true);
        try {
          const freshWallet = await getWallet();
          const freshBalance = parseFloat(freshWallet?.balance ?? "0");
          const prevBalance = balanceBeforeRef.current ?? 0;

          if (freshBalance <= prevBalance) {
            // Bakiye artmadi — kullanici odemeyi tamamlamadan kapatti
            setError("Odeme tamamlanmadi. Lutfen tekrar deneyin.");
            setPendingPlanId(null);
            setPurchasing(false);
            return;
          }

          await purchasePlan(pendingPlanId);
          setSuccess("Plan basariyla aktif edildi!");
          fetchData();
        } catch {
          setError("Odeme alindi ancak plan aktiflestirilirken hata olustu. Lutfen tekrar deneyin.");
        } finally {
          setPurchasing(false);
          setPendingPlanId(null);
          balanceBeforeRef.current = null;
        }
      };
      tryPurchase();
    }
  }, [showPayment, pendingPlanId]);

  async function handleWalletPurchase() {
    if (!selectedPlan) return;
    setError("");
    setSuccess("");
    setPurchasing(true);
    try {
      await purchasePlan(selectedPlan.id);
      setSuccess("Plan basariyla aktif edildi!");
      setSelectedPlan(null);
      fetchData();
    } catch (err: unknown) {
      const code = (err as { message?: string })?.message;
      if (code === "insufficient_balance") {
        setError("Yetersiz bakiye. Kredi karti ile odeme yapin veya once cuzdaniniza bakiye yukleyin.");
      } else if (code === "already_subscribed") {
        setError("Zaten aktif bir planiniz var.");
      } else {
        setError("Satin alma basarisiz oldu.");
      }
    } finally {
      setPurchasing(false);
    }
  }

  async function handleCardPurchase() {
    if (!selectedPlan) return;
    const price = parseFloat(selectedPlan.price);
    if (price <= 0) return;
    setError("");
    setPurchasing(true);
    try {
      const res = await initiateDeposit(price);
      if (res.provider === "iyzico") {
        setPaymentContent(res.checkoutFormContent ?? "");
        setPaymentIframeUrl("");
      } else {
        setPaymentIframeUrl(res.iframeUrl ?? "");
        setPaymentContent("");
      }
      balanceBeforeRef.current = balance;
      setPendingPlanId(selectedPlan.id);
      setShowPayment(true);
      setSelectedPlan(null);
    } catch {
      setError("Odeme sistemi baslatilamadi. Lutfen tekrar deneyin.");
    } finally {
      setPurchasing(false);
    }
  }

  async function handleCancel() {
    if (!confirm("Aktif planinizi iptal etmek istediginize emin misiniz?")) return;
    setCancelling(true);
    try {
      await cancelSubscription();
      setSuccess("Plan iptal edildi.");
      fetchData();
    } catch {
      setError("Iptal islemi basarisiz oldu.");
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <div className="flex flex-col gap-4"><SkeletonCard lines={3} /><SkeletonCard lines={4} /></div>;

  const usage = mySub?.usage;
  const pct = usage ? Math.round((usage.ilans_this_month / Math.max(usage.ilan_limit, 1)) * 100) : 0;
  const balance = parseFloat(wallet?.balance ?? "0");

  return (
    <div className="flex flex-col gap-6">
      {/* Mevcut Durum */}
      <div className="bg-surface rounded-xl border border-border-soft p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">Mevcut Durumunuz</h3>

        {mySub?.active && mySub.subscription ? (
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-lg font-extrabold text-foreground">{mySub.subscription.plan_name}</p>
              <p className="text-xs text-muted">Bitis: {formatDate(mySub.subscription.expires_at)}</p>
            </div>
            <Button variant="secondary" onClick={handleCancel} loading={cancelling} className="text-xs border-danger text-danger">
              Iptal Et
            </Button>
          </div>
        ) : mySub?.early_user ? (
          <div className="flex items-center gap-3 bg-brand/5 border border-brand/20 rounded-lg px-4 py-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-sm font-bold text-brand">Erken Uye Avantaji</p>
              <p className="text-xs text-muted">Ayda {mySub.free_quota} ucretsiz ilan hakkiniz var.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-bg-alt rounded-lg px-4 py-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="text-sm font-bold text-foreground">Ucretsiz Kota</p>
              <p className="text-xs text-muted">Ayda {mySub?.free_quota ?? 1} ucretsiz ilan hakkiniz var. Daha fazlasi icin plan satin alin.</p>
            </div>
          </div>
        )}

        {usage && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-muted">Bu Ay: {usage.ilans_this_month} / {usage.ilan_limit} ilan</span>
              <span className={cn(pct > 80 ? "text-danger" : pct > 50 ? "text-warning" : "text-success")}>
                {usage.remaining} kaldi
              </span>
            </div>
            <div className="w-full bg-bg-alt rounded-full h-2.5">
              <div
                className={cn("h-2.5 rounded-full transition-all", pct > 80 ? "bg-danger" : pct > 50 ? "bg-warning" : "bg-success")}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mesajlar */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 text-sm text-danger font-semibold">
          {error}
          {error.includes("bakiye") && <Link href="/panel/cuzdan?tab=deposit" className="underline ml-1">Cuzdana Git</Link>}
        </div>
      )}
      {success && <div className="bg-success/10 border border-success/30 rounded-lg px-4 py-3 text-sm text-success font-semibold">{success}</div>}

      {/* Odeme Yontemi Dialog */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-extrabold text-foreground mb-1">{selectedPlan.name}</h3>
            <p className="text-2xl font-black text-brand mb-4">₺{selectedPlan.price}<span className="text-xs text-muted font-medium"> /ay</span></p>

            <div className="bg-bg-alt rounded-lg px-4 py-3 mb-4">
              <p className="text-xs text-muted">Cuzdan Bakiyeniz</p>
              <p className={cn("text-lg font-extrabold", balance >= parseFloat(selectedPlan.price) ? "text-success" : "text-danger")}>
                ₺{balance.toFixed(2)}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleWalletPurchase}
                loading={purchasing}
                disabled={balance < parseFloat(selectedPlan.price)}
                className="w-full"
              >
                Bakiyeden Ode (₺{selectedPlan.price})
              </Button>
              {balance < parseFloat(selectedPlan.price) && (
                <p className="text-[10px] text-danger text-center font-semibold">Yetersiz bakiye</p>
              )}
              <Button
                variant="secondary"
                onClick={handleCardPurchase}
                loading={purchasing}
                className="w-full"
              >
                Kredi Karti ile Ode
              </Button>
            </div>

            <button
              onClick={() => setSelectedPlan(null)}
              className="mt-4 w-full text-center text-xs text-muted font-semibold hover:text-foreground"
            >
              Vazgec
            </button>
          </div>
        </div>
      )}

      {/* Plan Listesi */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3 px-1">Planlar</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = parseFloat(plan.price);
            const isCurrent = mySub?.subscription?.plan_id === plan.id;
            return (
              <div key={plan.id} className={cn("bg-surface rounded-xl border p-5 flex flex-col", isCurrent ? "border-brand ring-2 ring-brand/20" : "border-border-soft")}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-extrabold text-foreground">{plan.name}</h4>
                  {isCurrent && <Badge color="brand">Aktif</Badge>}
                </div>
                <p className="text-2xl font-black text-foreground mb-1">
                  {price === 0 ? "Ucretsiz" : `₺${plan.price}`}
                  {price > 0 && <span className="text-xs text-muted font-medium"> /ay</span>}
                </p>
                <p className="text-xs text-muted mb-4">
                  {plan.ilan_limit === 0 ? "Sinirsiz ilan" : `Ayda ${plan.ilan_limit} ilan`}
                </p>
                {plan.features.length > 0 && (
                  <ul className="flex flex-col gap-1.5 mb-4 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="text-xs text-muted flex items-center gap-1.5">
                        <span className="text-success">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  onClick={() => price === 0 ? handleFreeActivate(plan.id) : setSelectedPlan(plan)}
                  disabled={isCurrent || (mySub?.active && !isCurrent)}
                  className="w-full mt-auto"
                >
                  {isCurrent ? "Mevcut Plan" : price === 0 ? "Ucretsiz Baslat" : "Satin Al"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Iyzico/PayTR Payment Modal */}
      <PaymentModal
        show={showPayment}
        onClose={() => setShowPayment(false)}
        checkoutFormContent={paymentContent}
        iframeUrl={paymentIframeUrl}
        title="Plan Odemesi"
      />
    </div>
  );

  async function handleFreeActivate(planId: string) {
    setError("");
    setSuccess("");
    setPurchasing(true);
    try {
      await purchasePlan(planId);
      setSuccess("Plan basariyla aktif edildi!");
      fetchData();
    } catch {
      setError("Aktivasyon basarisiz oldu.");
    } finally {
      setPurchasing(false);
    }
  }
}
