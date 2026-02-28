import { describe, it, expect } from "vitest";
import { ALL_BUTTONS, ALL_AXES } from "../../src/gamepad/types.js";

describe("Gamepad Types", () => {
  it("should have all Xbox controller buttons", () => {
    expect(ALL_BUTTONS).toContain("a");
    expect(ALL_BUTTONS).toContain("b");
    expect(ALL_BUTTONS).toContain("x");
    expect(ALL_BUTTONS).toContain("y");
    expect(ALL_BUTTONS).toContain("dpup");
    expect(ALL_BUTTONS).toContain("dpdown");
    expect(ALL_BUTTONS).toContain("dpleft");
    expect(ALL_BUTTONS).toContain("dpright");
    expect(ALL_BUTTONS).toContain("leftshoulder");
    expect(ALL_BUTTONS).toContain("rightshoulder");
    expect(ALL_BUTTONS).toContain("start");
    expect(ALL_BUTTONS).toContain("back");
  });

  it("should have all standard axes", () => {
    expect(ALL_AXES).toContain("leftx");
    expect(ALL_AXES).toContain("lefty");
    expect(ALL_AXES).toContain("rightx");
    expect(ALL_AXES).toContain("righty");
    expect(ALL_AXES).toContain("lefttrigger");
    expect(ALL_AXES).toContain("righttrigger");
  });

  it("should have 15 buttons total", () => {
    expect(ALL_BUTTONS).toHaveLength(15);
  });

  it("should have 6 axes total", () => {
    expect(ALL_AXES).toHaveLength(6);
  });
});
