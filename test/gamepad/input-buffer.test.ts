import { describe, it, expect, beforeEach } from "vitest";
import { InputBuffer } from "../../src/gamepad/input-buffer.js";

describe("InputBuffer", () => {
  let buffer: InputBuffer;

  beforeEach(() => {
    buffer = new InputBuffer(5);
  });

  it("should store inputs", () => {
    buffer.push("a");
    buffer.push("b");
    expect(buffer.length).toBe(2);
  });

  it("should respect max size", () => {
    buffer.push("a");
    buffer.push("b");
    buffer.push("x");
    buffer.push("y");
    buffer.push("start");
    buffer.push("back");
    expect(buffer.length).toBe(5);
    // First item should be "b" (a was evicted)
    expect(buffer.getAll()[0].button).toBe("b");
  });

  it("should filter by time window", async () => {
    buffer.push("a");
    await new Promise((r) => setTimeout(r, 50));
    buffer.push("b");
    const recent = buffer.getRecent(30);
    expect(recent.length).toBe(1);
    expect(recent[0].button).toBe("b");
  });

  it("should clear buffer", () => {
    buffer.push("a");
    buffer.push("b");
    buffer.clear();
    expect(buffer.length).toBe(0);
  });
});
