import Link from 'next/link';
import {BLOG_POSTS, ROUTE_GUIDES} from './content.data';
export default function RelatedGuides({currentPath}:{currentPath:string}){
 return <nav aria-label="İlgili rehberler" className="mt-10 border-t border-border pt-8"><h2 className="text-xl font-semibold">Bir sonraki adım</h2><div className="mt-4 flex flex-wrap gap-x-6 gap-y-3"><Link className="min-h-11 text-brand" href="/ilanlar">Güncel taşıyıcı ilanları</Link>{[...BLOG_POSTS,...ROUTE_GUIDES].filter(p=>p.canonicalPath!==currentPath).map(p=><Link className="min-h-11 text-brand" key={p.slug} href={p.canonicalPath}>{p.title}</Link>)}<Link className="min-h-11 text-brand" href="/destek">Destek merkezi</Link></div></nav>;
}
