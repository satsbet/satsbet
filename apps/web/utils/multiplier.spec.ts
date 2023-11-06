import { expect, it } from "vitest";
import { calculateProfit } from "./multiplier";

it("should return zero when there's no other side", () => {
  const multiplier = calculateProfit(100, 0);
  expect(multiplier).toBe(0);
});

it("should multiplier be a fraction", () => {
  const amount1 = 100;
  const amount2 = 50;

  const expectedMultiplier = 0.5;
  const multiplier = calculateProfit(amount1, amount2);

  expect(multiplier).toBe(expectedMultiplier);
});

it("should multiplier be > 2", () => {
  const amount1 = 50;
  const amount2 = 500;

  const expectedMultiplier = 10;
  const multiplier = calculateProfit(amount1, amount2);

  expect(multiplier).toBe(expectedMultiplier);
});
