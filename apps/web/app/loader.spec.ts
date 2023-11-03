import { beforeEach, describe, expect, it, vi } from "vitest";
import { TOP_MULTIPLIER } from "./constants";
import { calculateMultiplier } from "./loader";

describe("multiplier", () => {
  beforeEach(() => {
    // Reset the mocks before each test
    vi.clearAllMocks();
  });

  describe("calculateMultiplier", () => {
    it("should return TOP_MULTIPLIER if amount2 is zero", () => {
      const multiplier = calculateMultiplier(100, 0);
      expect(multiplier).toBe(TOP_MULTIPLIER);
    });

    it("should multiplier be a fraction", () => {
      const amount1 = 100;
      const amount2 = 50;

      // 100 + 50 = 150 - 10% (fee) = 135 / 100 = 1.35
      const expectedMultiplier = 1.35;
      const multiplier = calculateMultiplier(amount1, amount2);

      expect(multiplier).toBe(expectedMultiplier);
    });

    it("should multiplier be > 2", () => {
      const amount1 = 50;
      const amount2 = 100;

      // 50 + 100 = 150 - 10% (fee) = 135 / 50 = 2.7
      const expectedMultiplier = 2.7;
      const multiplier = calculateMultiplier(amount1, amount2);

      expect(multiplier).toBeLessThanOrEqual(TOP_MULTIPLIER);
      expect(multiplier).toBe(expectedMultiplier);
    });

    it("should cap multiplier to TOP_MULTIPLIER", () => {
      const amount1 = 10;
      const amount2 = 100;
      // 10 + 100 = 110 - 10% (fee) = 99 / 10 = 9.9 (should be capped to 3)
      const expectedMultiplier = TOP_MULTIPLIER;
      const multiplier = calculateMultiplier(amount1, amount2);

      expect(multiplier).toBeLessThanOrEqual(TOP_MULTIPLIER);
      expect(multiplier).toBe(expectedMultiplier);
    });
  });
});
