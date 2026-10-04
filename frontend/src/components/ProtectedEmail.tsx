"use client";
// E-posta adresini spam botlarindan korur: sunucu HTML'inde "kullanici [at] alan" metni,
// tarayicida mount sonrasi tiklanabilir mailto baglantisi.
import { useEffect, useState } from "react";

export default function ProtectedEmail({ email, className, children }: { email: string; className?: string; children?: (address: string) => React.ReactNode }) {
  const [user, domain] = email.split("@");
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!user || !domain) return null;
  const masked = `${user} [at] ${domain}`;
  if (!ready) return <span className={className}>{children ? children(masked) : masked}</span>;
  const address = `${user}@${domain}`;
  return <a href={`mailto:${address}`} className={className}>{children ? children(address) : address}</a>;
}
