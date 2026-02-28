import { describe, it, expect } from "vitest";
import { HAPTIC_PATTERNS } from "../../src/haptic/patterns.js";

describe("Haptic Patterns", () => {
  it("should have all required patterns", () => {
    const expected = [
      "success",
      "error",
      "warning",
      "approval_prompt",
      "task_complete",
      "combo_activated",
      "rainbow",
    ];
    for (const name of expected) {
      expect(HAPTIC_PATTERNS[name]).toBeDefined();
    }
  });

  it("should have valid step values", () => {
    for (const [name, pattern] of Object.entries(HAPTIC_PATTERNS)) {
      expect(pattern.name).toBe(name);
      expect(pattern.steps.length).toBeGreaterThan(0);
      for (const step of pattern.steps) {
        expect(step.low).toBeGreaterThanOrEqual(0);
        expect(step.low).toBeLessThanOrEqual(65535);
        expect(step.high).toBeGreaterThanOrEqual(0);
        expect(step.high).toBeLessThanOrEqual(65535);
        expect(step.duration).toBeGreaterThan(0);
        expect(step.pause).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("combo_activated should be very short", () => {
    const combo = HAPTIC_PATTERNS["combo_activated"];
    const totalDuration = combo.steps.reduce(
      (sum, s) => sum + s.duration + s.pause,
      0,
    );
    expect(totalDuration).toBeLessThanOrEqual(100);
  });
});
