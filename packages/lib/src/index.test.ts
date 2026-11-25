import { describe, expect, it } from "vitest";
import { formatYearRange } from "./index.js";

describe("formatYearRange", () => {
  it("formats a range ending in the present", () => {
    expect(formatYearRange(2026)).toBe("2026–Present");
  });

  it("formats a range with an end year", () => {
    expect(formatYearRange(2025, 2026)).toBe("2025–2026");
  });
});
