import {render,screen,within} from '@testing-library/react';
import {expect,it} from 'vitest';
import {LegalPageView} from '../legal/LegalPageView';
import {legalHtml,legalDate} from '../legal/legal-content';
it('renders wrapped content with real list semantics and no duplicate page h1',()=>{
 render(<LegalPageView slug="tasima-kurallari" title="Taşıma kuralları" html={JSON.stringify({html:'<h1>Belge başlığı</h1><p>Metin aynen kalır.</p><ul><li>Paketleme kuralı</li></ul>'})}/>);
 expect(screen.getAllByRole('heading',{level:1})).toHaveLength(1);expect(screen.getByRole('heading',{name:'Belge başlığı',level:2})).toBeInTheDocument();expect(screen.getByText('Metin aynen kalır.')).toBeInTheDocument();expect(screen.getByRole('listitem')).toHaveTextContent('Paketleme kuralı');
});
it('builds a working contents menu for existing and generated anchors',async()=>{
 render(<LegalPageView slug="kvkk" title="KVKK" html={'<h2 id="haklar">Haklar</h2><p>Haklar metni</p><h2>Başvuru</h2><p>Başvuru metni</p>'}/>);
 const nav=await screen.findByRole('navigation',{name:'Bu sayfadaki bölümler'});expect(within(nav).getByRole('link',{name:'Haklar'})).toHaveAttribute('href','#haklar');const target=within(nav).getByRole('link',{name:'Başvuru'}).getAttribute('href')!.slice(1);expect(document.getElementById(target)).toHaveTextContent('Başvuru');
 expect(within(screen.getByRole('navigation',{name:'Yasal sayfalar'})).getByRole('link',{name:/KVKK/})).toHaveAttribute('aria-current','page');
});
it('omits invalid dates and contents navigation for a short document',()=>{
 render(<LegalPageView slug="tasima-kurallari" title="Kurallar" html="<h2>Kural</h2><p>Kısa belge.</p>" updatedAt="invalid"/>);expect(screen.queryByText(/Son güncelleme/)).not.toBeInTheDocument();expect(screen.queryByRole('navigation',{name:'Bu sayfadaki bölümler'})).not.toBeInTheDocument();expect(legalDate('2026-05-31T01:29:20.812Z')).toBe('31 Mayıs 2026');
});
it('preserves document wording when normalizing exported heading markup',()=>{
 const text='<h1\nid="eski">Ana belge</h1><h2 id="madde">1. Madde</h2><p><strong>Önemli:</strong> Metin &amp; haklar.</p>';
 expect(legalHtml(text).replace(/<[^>]*>/g,'')).toBe(text.replace(/<[^>]*>/g,''));expect(legalHtml(text)).toContain('id="eski"');expect(legalHtml(text)).not.toContain('<h1');
});
