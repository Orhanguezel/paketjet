import { TURKEY_CITIES } from '@/data/turkey-cities';
import { listIlans } from './ilan.service';
import type { IlanSearchFilters } from './ilan.type';

const normalize = (value: string) => value.trim().toLocaleLowerCase('tr-TR')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');

// Only explicit province segments are used; an unknown village is never guessed.
export function addressProvince(address?: string): string | undefined {
  for (const part of (address ?? '').split(',').reverse()) {
    const city = TURKEY_CITIES.find(city => normalize(city.value) === normalize(part));
    if (city) return city.value;
  }
}

export async function searchIlansWithAlternatives(filters: IlanSearchFilters) {
  const exact = await listIlans(filters);
  if (exact.total > 0) return { ...exact, alternativeScope: null };

  const nearby = { ...filters };
  const scope: string[] = [];
  for (const side of ['from', 'to'] as const) {
    const address = filters[`${side}_city`];
    const province = addressProvince(address);
    if (!province || normalize(province) === normalize(address ?? '')) continue;
    delete nearby[`${side}_city`];
    nearby[`${side}_province`] = province;
    scope.push(`${side === 'from' ? 'Kalkış' : 'Varış'}: ${province}`);
  }
  if (!scope.length) return { ...exact, alternativeScope: null };
  const alternatives = await listIlans(nearby);
  return alternatives.total > 0
    ? { ...alternatives, alternativeScope: scope.join(' · ') }
    : { ...exact, alternativeScope: null };
}
