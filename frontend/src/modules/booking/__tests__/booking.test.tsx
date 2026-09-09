import { expect, it, vi } from 'vitest';
import { redirect } from 'next/navigation';
import LegacyPage from '@/app/panel/tasiyici/page';
vi.mock('next/navigation',()=>({redirect:vi.fn()}));
it('retired carrier dashboard redirects to the current contact marketplace panel',()=>{LegacyPage();expect(redirect).toHaveBeenCalledWith('/panel');});
