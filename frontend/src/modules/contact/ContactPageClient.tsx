"use client";
import ProtectedEmail from "@/components/ProtectedEmail";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Mail, MapPin, Phone, Send, Truck } from "lucide-react";
import { createContact } from "./contact.service";
import type { ContactFormData } from "./contact.type";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/config/routes";

const INITIAL_FORM: ContactFormData = { name: "", email: "", phone: "", subject: "", message: "" };
interface ContactInfo { company_name?: string; phone?: string; phone_2?: string; email?: string; email_2?: string; address?: string; working_hours?: string }

export function ContactPageClient({ contactInfo }: { contactInfo?: ContactInfo | null }) {
  const [form, setForm] = useState(INITIAL_FORM), [saving, setSaving] = useState(false), [done, setDone] = useState(false), [error, setError] = useState("");
  const email = contactInfo?.email_2 || contactInfo?.email;
  const phone = [contactInfo?.phone_2, contactInfo?.phone].find((value) => value && !/0000000/.test(value.replace(/\D/g, "")));
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true); setError(""); setDone(false);
    try { await createContact(form); setForm(INITIAL_FORM); setDone(true); }
    catch { setError("Mesaj gönderilemedi. Bilgileriniz korunuyor; tekrar deneyin."); }
    finally { setSaving(false); }
  }
  return <div className="contact-page">
    <header className="contact-hero"><div className="site-container"><span className="contact-hero-icon" aria-hidden="true"><Send size={22}/></span><h1>Bize ulaşın</h1><p>İlanınız, iletişim erişiminiz veya hesabınızla ilgili talebinizi iletin.</p></div></header>
    <div className="site-container contact-container">
      <div className="contact-grid"><div className="contact-aside">
        <div className="contact-illustration" aria-hidden="true"><span className="contact-pin contact-pin-start"><MapPin size={30}/></span><span className="contact-route"/><span className="contact-truck"><Truck size={70} strokeWidth={1.4}/></span><span className="contact-pin contact-pin-end"><MapPin size={30}/></span></div>
        <section className="contact-info-card" aria-label="İletişim bilgileri"><h2>İletişim bilgileri</h2>
          {email && <ProtectedEmail email={email} className="contact-method">{(address)=><><span><Mail size={22}/></span><span><strong>E-posta</strong><em>{address}</em></span><ArrowUpRight size={17}/></>}</ProtectedEmail>}
          {phone && <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="contact-method"><span><Phone size={22}/></span><span><strong>Telefon</strong><em>{phone}</em></span><ArrowUpRight size={17}/></a>}
          {contactInfo?.company_name && <p className="contact-company">{contactInfo.company_name}</p>}
          {contactInfo?.address && <p className="contact-address">{contactInfo.address}</p>}
          {contactInfo?.working_hours && <p className="contact-address">{contactInfo.working_hours}</p>}
          <p className="contact-note">Talebinizi mümkün olduğunca detaylı iletmeniz, size daha hızlı yardımcı olmamızı sağlar.</p>
        </section>
      </div><form method="post" onSubmit={handleSubmit} className="contact-form"><h2>Bize mesaj gönderin</h2><div className="contact-fields">
        {([{key:"name",label:"Ad soyad",type:"text",auto:"name",placeholder:"Adınız ve soyadınız"},{key:"email",label:"E-posta",type:"email",auto:"email",placeholder:"E-posta adresin"},{key:"phone",label:"Telefon",type:"tel",auto:"tel",placeholder:"Telefon numaranız"},{key:"subject",label:"Konu",type:"text",auto:"off",placeholder:"Talebinizin konusu"}] as const).map((field) => <label key={field.key} htmlFor={`contact-${field.key}`}><span>{field.label}</span><input id={`contact-${field.key}`} name={field.key} type={field.type} autoComplete={field.auto} placeholder={field.placeholder} required minLength={field.key==="phone"?5:field.key==="subject"||field.key==="name"?2:undefined} maxLength={field.key==="subject"?200:100} value={form[field.key]} onChange={(event)=>setForm({...form,[field.key]:event.target.value})}/></label>)}
        <label htmlFor="contact-message" className="contact-message-label"><span>Mesajınız</span><textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={6} placeholder="Talebinizi detaylı olarak yazın..." value={form.message} onChange={(event)=>setForm({...form,message:event.target.value})}/></label>
      </div>{error&&<p role="alert" className="contact-feedback text-danger">{error}</p>}{done&&<p role="status" className="contact-feedback text-success">Mesajınız alındı. Talebiniz destek ekibine iletildi.</p>}<Button type="submit" disabled={saving} className="contact-submit">{saving?"Gönderiliyor…":"Mesajı gönder"}</Button></form></div>
      <aside className="contact-help"><span className="contact-help-icon"><BookOpen size={25}/></span><div><h2>Daha fazla yardıma mı ihtiyacınız var?</h2><p>Yardım merkezindeki yanıtları inceleyebilirsiniz.</p></div><Link href={ROUTES.static.destek}>Yardım merkezi <ArrowUpRight size={18}/></Link></aside>
    </div></div>;
}
