import Link from 'next/link';
import {FAQPageSchema} from '@/components/JsonLd';
import {PRODUCT_FAQS,PRODUCT_SUMMARY} from '@/modules/content/product-facts';
export default function HomeAnswers(){
 return <section className="site-container py-14 sm:py-20" aria-labelledby="home-answers-title">
  <FAQPageSchema items={PRODUCT_FAQS}/>
  <div className="grid gap-10 lg:grid-cols-2">
   <div><h2 id="home-answers-title" className="text-3xl font-bold tracking-tight">PaketJet hakkında merak edilenler</h2><p className="mt-5 max-w-xl leading-8 text-muted">{PRODUCT_SUMMARY}</p><Link href="/blog/paketjet-nasil-kullanilir" className="mt-6 inline-flex min-h-11 items-center font-semibold text-brand">Kullanım rehberini incele →</Link></div>
   <div>{PRODUCT_FAQS.map(item=><details key={item.question} className="border-b border-border py-5"><summary className="cursor-pointer font-semibold leading-7">{item.question}</summary><p className="mt-3 leading-7 text-muted">{item.answer}</p></details>)}</div>
  </div>
 </section>;
}
