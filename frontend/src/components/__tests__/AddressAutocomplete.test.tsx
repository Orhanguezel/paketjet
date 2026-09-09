import {useState} from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {AddressAutocomplete} from '@paketjet/locations';
const village={id:'osm-1',label:'Şirince, Selçuk, İzmir, Türkiye',city:'İzmir',lat:37.94,lng:27.43};
function Field(){const [value,setValue]=useState('');return <AddressAutocomplete label="Nereden" value={value} onChange={setValue}/>;}
afterEach(()=>vi.unstubAllGlobals());
it('selects a village with keyboard and only loads its map on request',async()=>{
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({data:[village]})}));render(<Field/>);
 const input=screen.getByRole('combobox');fireEvent.change(input,{target:{value:'Şirince'}});
 await screen.findByRole('option',{name:village.label});fireEvent.keyDown(input,{key:'ArrowDown'});fireEvent.keyDown(input,{key:'Enter'});
 expect(input).toHaveValue(village.label);expect(screen.queryByRole('listbox')).not.toBeInTheDocument();expect(document.querySelector('iframe')).toBeNull();
 const details=screen.getByText('Haritada göster').closest('details')!;details.open=true;fireEvent(details,new Event('toggle'));
 await waitFor(()=>expect(document.querySelector('iframe')?.src).toContain('marker=37.94%2C27.43'));
 fireEvent.change(input,{target:{value:'Başka köy'}});expect(document.querySelector('iframe')).toBeNull();
});
it('allows a typed rural address when the provider is unavailable',async()=>{
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false}));render(<Field/>);const input=screen.getByRole('combobox');fireEvent.change(input,{target:{value:'Orman yolu 14. kilometre'}});
 await screen.findByText(/Öneriler şu anda alınamıyor/);expect(input).toHaveValue('Orman yolu 14. kilometre');fireEvent.keyDown(input,{key:'Escape'});expect(input).toHaveAttribute('aria-expanded','false');
});

it('ignores late suggestions from a previous query',async()=>{
 let resolveOld:(value:unknown)=>void=()=>{};
 const lookup=vi.fn().mockImplementationOnce(()=>new Promise(resolve=>{resolveOld=resolve;})).mockResolvedValue({ok:true,json:async()=>({data:[village]})});
 vi.stubGlobal('fetch',lookup);render(<Field/>);const input=screen.getByRole('combobox');fireEvent.change(input,{target:{value:'Eski adres'}});await waitFor(()=>expect(lookup).toHaveBeenCalledOnce());
 fireEvent.change(input,{target:{value:'Şirince'}});await screen.findByRole('option',{name:village.label});resolveOld({ok:true,json:async()=>({data:[{...village,label:'Yanlış eski sonuç'}]})});
 await waitFor(()=>expect(screen.queryByRole('option',{name:'Yanlış eski sonuç'})).not.toBeInTheDocument());expect(screen.getByRole('option',{name:village.label})).toBeInTheDocument();
});
