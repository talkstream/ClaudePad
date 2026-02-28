import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  ComboDetector,
  type ComboDefinition,
} from "../../src/gamepad/combo-detector.js";

describe("ComboDetector", () => {
  let detector: ComboDetector;

  const testCombos: ComboDefinition[] = [
    {
      name: "test_double_a",
      sequence: ["a", "a"],
      windowMs: 500,
      description: "Double A press",
      level: "novice",
    },
    {
      name: "test_abc",
      sequence: ["a", "b", "x"],
      windowMs: 1000,
      description: "A-B-X sequence",
      level: "advanced",
    },
  ];

  beforeEach(() => {
    detector = new ComboDetector(testCombos);
  });

  it("should detect a simple two-button combo", () => {
    const handler = vi.fn();
    detector.on("combo:detected", handler);

    detector.recordInput("a");
    const result = detector.recordInput("a");

    expect(result).not.toBeNull();
    expect(result!.name).toBe("test_double_a");
    expect(handler).toHaveBeenCalledOnce();
  });

  it("should detect a three-button combo", () => {
    detector.recordInput("a");
    detector.recordInput("b");
    const result = detector.recordInput("x");

    expect(result).not.toBeNull();
    expect(result!.name).toBe("test_abc");
  });

  it("should not detect incomplete combo", () => {
    detector.recordInput("a");
    const result = detector.recordInput("b");

    expect(result).toBeNull();
  });

  it("should not detect wrong sequence", () => {
    detector.recordInput("b");
    detector.recordInput("a");
    const result = detector.recordInput("x");

    expect(result).toBeNull();
  });

  it("should list combos", () => {
    const combos = detector.getCombos();
    expect(combos).toHaveLength(2);
  });

  it("should allow adding combos", () => {
    detector.addCombo({
      name: "custom",
      sequence: ["y", "y"],
      windowMs: 300,
      description: "Custom combo",
      level: "master",
    });
    expect(detector.getCombos()).toHaveLength(3);
  });
});
