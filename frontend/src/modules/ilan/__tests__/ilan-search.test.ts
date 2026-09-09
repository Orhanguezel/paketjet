import { beforeEach, expect, it, vi } from 'vitest';
import { listIlans } from '../ilan.service';
import { addressProvince, searchIlansWithAlternatives } from '../ilan-search.service';

vi.mock('../ilan.service', () => ({ listIlans: vi.fn() }));
const list = vi.mocked(listIlans);
const empty = { data: [], total: 0, page: 1, limit: 20 };
beforeEach(() => list.mockReset());

it('finds explicit provinces, including legacy ASCII, without guessing villages', () => {
  expect(addressProvince('Şirince, Selçuk, İzmir, Türkiye')).toBe('İzmir');
  expect(addressProvince('Kadikoy, Istanbul, Türkiye')).toBe('İstanbul');
  expect(addressProvince('Ankara, mahalle, İzmir, Türkiye')).toBe('İzmir');
  expect(addressProvince('Şirince')).toBeUndefined();
  expect(addressProvince('Van Gogh Caddesi')).toBeUndefined();
});

it('keeps exact matches and never broadens an empty later page of existing results', async () => {
  list.mockResolvedValue({ ...empty, total: 21, page: 3 });
  expect((await searchIlansWithAlternatives({ from_city: 'Şirince, İzmir', page: 3 })).alternativeScope).toBeNull();
  expect(list).toHaveBeenCalledTimes(1);
});

it('broadens both address endpoints while retaining date, vehicle, direction and pagination', async () => {
  list.mockResolvedValueOnce(empty).mockResolvedValueOnce({ ...empty, total: 30, page: 2 });
  const filters = { from_city: 'Şirince, İzmir, Türkiye', to_city: 'Beypazarı, Ankara, Türkiye', date: '2026-12-01', vehicle_type: 'van' as const, page: 2, limit: 20 };
  const result = await searchIlansWithAlternatives(filters);
  expect(list).toHaveBeenNthCalledWith(2, { from_province: 'İzmir', to_province: 'Ankara', date: filters.date, vehicle_type: 'van', page: 2, limit: 20 });
  expect(result.alternativeScope).toBe('Kalkış: İzmir · Varış: Ankara');
  expect(result.total).toBe(30);
  expect(filters.from_city).toBe('Şirince, İzmir, Türkiye');
});

it('preserves an unknown opposite endpoint and leaves empty alternatives empty', async () => {
  list.mockResolvedValue(empty);
  const result = await searchIlansWithAlternatives({ from_city: 'Şirince, İzmir', to_city: 'Özel nokta' });
  expect(list).toHaveBeenLastCalledWith({ from_province: 'İzmir', to_city: 'Özel nokta' });
  expect(result.alternativeScope).toBeNull();
});

it('does not broaden a city-only or unlocated query', async () => {
  list.mockResolvedValue(empty);
  await searchIlansWithAlternatives({ from_city: 'İzmir', to_city: 'Bilinmeyen köy' });
  expect(list).toHaveBeenCalledTimes(1);
});

it('does not disguise API failures as empty results or drop filters to recover', async () => {
  list.mockRejectedValueOnce(new Error('offline'));
  await expect(searchIlansWithAlternatives({ from_city: 'Şirince, İzmir' })).rejects.toThrow('offline');
  expect(list).toHaveBeenCalledTimes(1);
});
