import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const mockIsConnected = vi.fn();
const mockRumble = vi.fn();

vi.mock("../../src/gamepad/manager.js", () => ({
  GamepadManager: {
    getInstance: () => ({
      isConnected: mockIsConnected,
      rumble: mockRumble,
    }),
  },
}));

const mockPlayPattern = vi.fn();
const mockPlayCustom = vi.fn();

vi.mock("../../src/haptic/feedback-engine.js", () => ({
  HapticFeedbackEngine: vi.fn().mockImplementation(() => ({
    playPattern: mockPlayPattern,
    playCustom: mockPlayCustom,
  })),
}));

import { registerRumbleTool } from "../../src/mcp/tools/rumble.js";
import { HapticFeedbackEngine } from "../../src/haptic/feedback-engine.js";

describe("gamepad_rumble MCP tool", () => {
  let server: McpServer;
  let registeredHandler: (args: Record<string, unknown>) => Promise<unknown>;
  let hapticEngine: HapticFeedbackEngine;

  beforeEach(() => {
    vi.clearAllMocks();

    server = {
      tool: vi.fn((_name: string, _desc: string, _schema: unknown, handler: unknown) => {
        registeredHandler = handler as typeof registeredHandler;
      }),
    } as unknown as McpServer;

    hapticEngine = {
      playPattern: mockPlayPattern,
      playCustom: mockPlayCustom,
    } as unknown as HapticFeedbackEngine;

    registerRumbleTool(server, hapticEngine);
  });

  it("should register the tool with correct name", () => {
    expect(server.tool).toHaveBeenCalledWith(
      "gamepad_rumble",
      expect.any(String),
      expect.any(Object),
      expect.any(Function),
    );
  });

  it("should return error when no controller connected", async () => {
    mockIsConnected.mockReturnValue(false);

    const result = await registeredHandler({});
    const parsed = JSON.parse((result as any).content[0].text);

    expect(parsed.error).toBe("No controller connected");
    expect((result as any).isError).toBe(true);
  });

  it("should play a named pattern", async () => {
    mockIsConnected.mockReturnValue(true);
    mockPlayPattern.mockResolvedValue(undefined);

    const result = await registeredHandler({ pattern: "success" });
    const parsed = JSON.parse((result as any).content[0].text);

    expect(mockPlayPattern).toHaveBeenCalledWith("success");
    expect(parsed.success).toBe(true);
    expect(parsed.pattern).toBe("success");
  });

  it("should play custom rumble steps", async () => {
    mockIsConnected.mockReturnValue(true);
    mockPlayCustom.mockResolvedValue(undefined);

    const custom = [{ low: 30000, high: 15000, duration: 200, pause: 0 }];
    const result = await registeredHandler({ custom });
    const parsed = JSON.parse((result as any).content[0].text);

    expect(mockPlayCustom).toHaveBeenCalledWith(custom);
    expect(parsed.success).toBe(true);
    expect(parsed.pattern).toBe("custom");
  });

  it("should fall back to default rumble when no pattern or custom given", async () => {
    mockIsConnected.mockReturnValue(true);

    const result = await registeredHandler({});
    const parsed = JSON.parse((result as any).content[0].text);

    expect(mockRumble).toHaveBeenCalledWith(30000, 15000, 200);
    expect(parsed.success).toBe(true);
    expect(parsed.pattern).toBe("default");
  });

  it("should return error when playPattern throws", async () => {
    mockIsConnected.mockReturnValue(true);
    mockPlayPattern.mockRejectedValue(new Error("Rumble failed"));

    const result = await registeredHandler({ pattern: "error" });
    const parsed = JSON.parse((result as any).content[0].text);

    expect(parsed.error).toBe("Rumble failed");
    expect((result as any).isError).toBe(true);
  });
});
