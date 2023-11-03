import { describe, it, expect } from "vitest";
import { localCalculateMultiplier } from "./route";
import { TOP_MULTIPLIER } from "../../../constants";

describe("localCalculateMultiplier", () => {
  it("should return TOP_MULTIPLIER when amountDown is 0 and bet is UP", () => {
    expect(localCalculateMultiplier("UP", 100, 0)).toBe(TOP_MULTIPLIER);
  });

  it("should return TOP_MULTIPLIER when amountUp is 0 and bet is DOWN", () => {
    expect(localCalculateMultiplier("DOWN", 0, 100)).toBe(TOP_MULTIPLIER);
  });

  it("should calculate multiplier correctly when bet is UP", () => {
    const amountUp = 200;
    const amountDown = 100;
    const expectedMultiplier = 1.35;
    expect(localCalculateMultiplier("UP", amountUp, amountDown)).toBe(
      expectedMultiplier,
    );
  });

  it("should calculate multiplier correctly when bet is UP - 2", () => {
    const amountUp = 100;
    const amountDown = 200;
    const expectedMultiplier = 2.7;
    expect(localCalculateMultiplier("UP", amountUp, amountDown)).toBe(
      expectedMultiplier,
    );
  });

  it("should calculate multiplier correctly when bet is DOWN", () => {
    const amountUp = 200;
    const amountDown = 100;
    const expectedMultiplier = 2.7;
    expect(localCalculateMultiplier("DOWN", amountUp, amountDown)).toBe(
      expectedMultiplier,
    );
  });

  it("should calculate multiplier correctly when bet is DOWN - 2", () => {
    const amountUp = 100;
    const amountDown = 200;
    const expectedMultiplier = 1.35;
    expect(localCalculateMultiplier("DOWN", amountUp, amountDown)).toBe(
      expectedMultiplier,
    );
  });

  it("should not exceed TOP_MULTIPLIER", () => {
    expect(localCalculateMultiplier("UP", 100, 1000)).toBe(TOP_MULTIPLIER);
  });

  it("should handle 0 pot correctly", () => {
    expect(localCalculateMultiplier("UP", 0, 100)).toBe(TOP_MULTIPLIER);
  });

  it("should not exceed TOP_MULTIPLIER - 2", () => {
    expect(localCalculateMultiplier("DOWN", 1000, 100)).toBe(TOP_MULTIPLIER);
  });

  it("should handle 0 pot correctly - 2", () => {
    expect(localCalculateMultiplier("DOWN", 100, 0)).toBe(TOP_MULTIPLIER);
  });
});
