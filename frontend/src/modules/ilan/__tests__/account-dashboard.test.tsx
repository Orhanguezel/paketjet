import { render, screen } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import PanelRoot from '@/app/panel/page';
import { getMyIlans } from '../ilan.service';
import { getMyCredits, getMyPurchases } from '@/modules/purchases/purchases.service';
vi.mock('../ilan.service',()=>({getMyIlans:vi.fn()}));
vi.mock('@/modules/purchases/purchases.service',()=>({getMyCredits:vi.fn(),getMyPurchases:vi.fn()}));
beforeEach(()=>{vi.mocked(getMyIlans).mockResolvedValue([]);vi.mocked(getMyCredits).mockResolvedValue({balance:0,ledger:[]});vi.mocked(getMyPurchases).mockResolvedValue({data:[]});});
it('uses real empty states and working destinations without inventing activity',async()=>{
 render(<PanelRoot/>);expect(await screen.findByText('Henüz ilan oluşturmadın.')).toBeInTheDocument();expect(screen.getByText('Henüz iletişim erişimin yok.')).toBeInTheDocument();expect(screen.getByRole('link',{name:'Ücretsiz ilan ver'})).toHaveAttribute('href','/ilan-ver');expect(screen.getByRole('link',{name:'Profilini düzenle'})).toHaveAttribute('href','/panel/profil');
});
it('reports failed account data instead of showing a zero balance',async()=>{
 vi.mocked(getMyCredits).mockRejectedValue(new Error('offline'));render(<PanelRoot/>);expect(await screen.findByRole('alert')).toHaveTextContent('Hak bakiyesi yüklenemedi');expect(screen.getByText('Alınamadı')).toBeInTheDocument();
});
