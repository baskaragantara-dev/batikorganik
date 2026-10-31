import { describe, expect, it } from 'vitest';
import { DEFAULT_ASSUMPTIONS, PACKAGES, grossMargin, monthlyCost, priceForMargin, quotePackage, waOveragePrice } from './pricing';

const pkg = (id: string) => {
  const found = PACKAGES.find((p) => p.id === id);
  if (!found) throw new Error(id);
  return found;
};

describe('monthlyCost', () => {
  it('converts USD with the FX buffer and adds VPS and WhatsApp', () => {
    const c = monthlyCost(pkg('starter').cost, DEFAULT_ASSUMPTIONS);
    // 60 USD x 16.500 x 1,1 = 1.089.000; 500 x 586,33 = 293.165
    expect(c.usdCostsIdr).toBe(1_089_000);
    expect(c.waIdr).toBe(293_165);
    expect(c.total).toBe(1_089_000 + 150_000 + 293_165);
  });

  it('rejects an invalid FX rate', () => {
    expect(() => monthlyCost(pkg('starter').cost, { fxIdrPerUsd: 0, fxBuffer: 0 })).toThrow();
  });
});

describe('priceForMargin', () => {
  it('rounds up to Rp100 ribu and never drops below the target margin', () => {
    const price = priceForMargin(1_532_165, 0.6);
    expect(price).toBe(3_900_000);
    expect(grossMargin(price, 1_532_165)).toBeGreaterThanOrEqual(0.6);
  });

  it('rejects a margin of 95% or more', () => {
    expect(() => priceForMargin(1_000_000, 0.95)).toThrow(RangeError);
  });
});

describe('quotePackage', () => {
  it('keeps every default package at or above its default margin', () => {
    for (const p of PACKAGES) {
      const q = quotePackage(p, p.defaultMargin, DEFAULT_ASSUMPTIONS);
      expect(q.margin).toBeGreaterThanOrEqual(p.defaultMargin);
      expect(q.price).toBeGreaterThan(q.cost.total);
    }
  });

  it('prices packages in ascending order', () => {
    const prices = PACKAGES.map((p) => quotePackage(p, p.defaultMargin, DEFAULT_ASSUMPTIONS).price);
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  });
});

describe('waOveragePrice', () => {
  it('adds the markup and rounds up to whole rupiah', () => {
    expect(waOveragePrice(0.2)).toBe(704);
  });
});
