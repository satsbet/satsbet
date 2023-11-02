import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOP_MULTIPLIER } from './constants';
import { calculateMultiplier, getMultiplier, getTodayPaidBets } from './multipliers';

describe('multiplier', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    vi.clearAllMocks();
  });

  describe('calculateMultiplier', () => {
    it('should return TOP_MULTIPLIER if amount2 is zero', () => {
      const multiplier = calculateMultiplier(100n, 0n);
      expect(multiplier).toBe(TOP_MULTIPLIER);
    });

    it('should correctly calculate the multiplier above 1', () => {
      const amount1 = 100n;
      const amount2 = 50n;
      const expectedMultiplier = 1.8;
      const multiplier = calculateMultiplier(amount1, amount2);

      expect(multiplier).toBeLessThanOrEqual(TOP_MULTIPLIER);
      expect(multiplier).toBe(expectedMultiplier);
    });

    it('should correctly calculate the multiplier below 1', () => {
        const amount1 = 50n;
        const amount2 = 100n;
        const expectedMultiplier = 0.45;
        const multiplier = calculateMultiplier(amount1, amount2);
  
        expect(multiplier).toBeLessThanOrEqual(TOP_MULTIPLIER);
        expect(multiplier).toBe(expectedMultiplier);
    });

    it('should correctly calculate the multiplier above 4', () => {
        const amount1 = 300n;
        const amount2 = 50n;
        const expectedMultiplier = TOP_MULTIPLIER;
        const multiplier = calculateMultiplier(amount1, amount2);
  
        expect(multiplier).toBeLessThanOrEqual(TOP_MULTIPLIER);
        expect(multiplier).toBe(expectedMultiplier);
      });
    });

});
