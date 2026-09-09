import { expect, it } from 'vitest';
import { safeReturnPath } from '../safe-redirect';
import { formatDate } from '../date';
it('return path never leaves the application',()=>{for(const value of ['https://evil.test','//evil.test','/\\evil.test','javascript:alert(1)'])expect(safeReturnPath(value)).toBe('/panel');expect(safeReturnPath('/ilanlar/example?from=Ankara')).toBe('/ilanlar/example?from=Ankara');});
it('SQL and ISO dates show the same Istanbul instant',()=>{expect(formatDate('2026-09-12 06:00:00')).toBe(formatDate('2026-09-12T06:00:00Z'));expect(formatDate('2026-09-12T06:00:00Z')).toContain('09:00');});
