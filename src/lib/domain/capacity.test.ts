import { describe, expect, it } from 'vitest';
import { effectiveOutput, hppPerContent } from './capacity';

describe('effectiveOutput', () => {
  it('equals the theoretical output when everything passes first time', () => {
    expect(effectiveOutput(60, 1)).toBe(60);
  });

  it('drops to 40 per day when half needs one revision', () => {
    expect(effectiveOutput(60, 0.5)).toBe(40);
  });

  it('rejects a pass rate of zero', () => {
    expect(() => effectiveOutput(60, 0)).toThrow(RangeError);
  });
});

describe('hppPerContent', () => {
  it('matches the manual baseline of the concept doc (about Rp227 ribu)', () => {
    const r = hppPerContent({ teamMonthlyIdr: 10_000_000, systemMonthlyIdr: 0, theoreticalPerDay: 2, firstPassRate: 1, workDays: 22 });
    expect(r.outputPerMonth).toBe(44);
    expect(r.hppPerContent).toBe(227_273);
  });

  it('returns zero instead of dividing by zero', () => {
    const r = hppPerContent({ teamMonthlyIdr: 1, systemMonthlyIdr: 0, theoreticalPerDay: 0, firstPassRate: 1, workDays: 22 });
    expect(r.hppPerContent).toBe(0);
  });
});
