"use client";
import type { Wallet } from "@/modules/wallet/wallet.type";
import { useAuthStore } from "@/modules/auth/auth.store";

interface Props {
  wallet: Wallet | null;
  loading: boolean;
  hasPendingWithdrawal?: boolean;
}

export default function BakiyeCard({ wallet, loading, hasPendingWithdrawal }: Props) {
  const { user } = useAuthStore();
  const isCarrier = user?.role === "carrier";

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="bg-brand rounded-2xl p-6 text-white shadow-lg shadow-brand/20">
        <p className="text-sm font-medium opacity-80 mb-1">Mevcut Bakiye</p>
        <p className="text-4xl font-extrabold tracking-tight">
          ₺{loading ? "—" : wallet?.balance ?? "0.00"}
        </p>
        
        {isCarrier && (
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Toplam Kazanç</p>
              <p className="text-lg font-bold">₺{wallet?.total_earnings ?? "0.00"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Toplam Çekim</p>
              <p className="text-lg font-bold">₺{wallet?.total_withdrawn ?? "0.00"}</p>
            </div>
          </div>
        )}
      </div>

      {hasPendingWithdrawal && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-xl">⏳</span>
          <div>
            <p className="text-sm font-bold text-warning-dark">Bekleyen Para Çekme Talebi</p>
            <p className="text-xs text-warning-dark/80">İşlemdeki talebiniz onaylandığında bilgilendirileceksiniz.</p>
          </div>
        </div>
      )}
    </div>
  );
}
