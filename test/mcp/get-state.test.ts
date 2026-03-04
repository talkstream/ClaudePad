import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Mock GamepadManager before importing the tool
const mockGetState = vi.fn();
vi.mock("../../src/gamepad/manager.js", () => ({
  GamepadManager: {
    getInstance: () => ({
      getState: mockGetState,
    }),
  },
}));

import { registerGetStateTool } from "../../src/mcp/tools/get-state.js";

describe("gamepad_get_state MCP tool", () => {
  let server: McpServer;
  let registeredHandler: (args: Record<string, unknown>) => Promise<unknown>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Capture the tool handler during registration
    server = {
      tool: vi.fn((_name: string, _desc: string, _schema: unknown, handler: unknown) => {
        registeredHandler = handler as typeof registeredHandler;
      }),
    } as unknown as McpServer;

    registerGetStateTool(server);
  });

  it("should register the tool with correct name", () => {
    expect(server.tool).toHaveBeenCalledWith(
      "gamepad_get_state",
      expect.any(String),
      expect.any(Object),
      expect.any(Function),
    );
  });

  it("should return gamepad state as JSON text content", async () => {
    const fakeState = {
      connected: true,
      name: "Xbox Wireless Controller",
      player: 0,
      buttons: { a: { pressed: false, timestamp: 1000 } },
      axes: {},
      hasRumble: true,
      batteryLevel: "full",
    };
    mockGetState.mockReturnValue(fakeState);

    const result = await registeredHandler({});

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: JSON.stringify(fakeState, null, 2),
        },
      ],
    });
  });

  it("should return disconnected state when no controller", async () => {
    const disconnectedState = {
      connected: false,
      name: null,
      player: null,
      buttons: {},
      axes: {},
      hasRumble: false,
      batteryLevel: null,
    };
    mockGetState.mockReturnValue(disconnectedState);

    const result = await registeredHandler({});
    const parsed = JSON.parse((result as any).content[0].text);

    expect(parsed.connected).toBe(false);
    expect(parsed.name).toBeNull();
  });
});
