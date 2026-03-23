import Link from "next/link";
import { ROUTES } from "@/config/routes";

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/10 py-12">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-white font-extrabold text-lg">PaketJet</p>
          <p className="text-white/40 text-sm">© 2026 PaketJet. Tüm hakları saklıdır.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link href={ROUTES.static.hakkinda} title="PaketJet Hakkimizda" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">Hakkımızda</Link>
          <Link href={ROUTES.static.gizlilik} title="PaketJet Gizlilik Politikasi" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">Gizlilik</Link>
          <Link href={ROUTES.static.kvkk} title="PaketJet KVKK" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">KVKK</Link>
          <Link href={ROUTES.static.kullanim} title="PaketJet Kullanim Kosullari" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">Kullanım Şartları</Link>
          <Link href={ROUTES.static.tasimaKurallari} title="PaketJet Taşıma Kuralları" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">Taşıma Kuralları</Link>
          <Link href={ROUTES.static.iletisim} title="PaketJet Iletisim" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">İletişim</Link>
          <Link href={ROUTES.static.destek} title="PaketJet Destek Merkezi" className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors">Destek</Link>
        </div>
      </div>
    </footer>
  );
}
