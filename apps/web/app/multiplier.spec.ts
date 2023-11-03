import { beforeEach, describe, expect, it, vi } from "vitest";
import { TOP_MULTIPLIER } from "./constants";
import { calculateMultiplier } from "./multipliers";

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

    it("should correctly calculate the multiplier above 1", () => {
      const amount1 = 100;
      const amount2 = 50;
      const expectedMultiplier = 1.8;
      const multiplier = calculateMultiplier(amount1, amount2);

      expect(multiplier).toBeLessThanOrEqual(TOP_MULTIPLIER);
      expect(multiplier).toBe(expectedMultiplier);
    });

    it("should correctly calculate the multiplier below 1", () => {
      const amount1 = 50;
      const amount2 = 100;
      const expectedMultiplier = 0.45;
      const multiplier = calculateMultiplier(amount1, amount2);

      expect(multiplier).toBeLessThanOrEqual(TOP_MULTIPLIER);
      expect(multiplier).toBe(expectedMultiplier);
    });

    it("should correctly calculate the multiplier above 4", () => {
      const amount1 = 300;
      const amount2 = 50;
      const expectedMultiplier = TOP_MULTIPLIER;
      const multiplier = calculateMultiplier(amount1, amount2);

      expect(multiplier).toBeLessThanOrEqual(TOP_MULTIPLIER);
      expect(multiplier).toBe(expectedMultiplier);
    });
  });
});
