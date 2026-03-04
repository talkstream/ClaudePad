import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const mockIsConnected = vi.fn();
const mockWaitForButton = vi.fn();

vi.mock("../../src/gamepad/manager.js", () => ({
  GamepadManager: {
    getInstance: () => ({
      isConnected: mockIsConnected,
      waitForButton: mockWaitForButton,
    }),
  },
}));

import { registerWaitButtonTool } from "../../src/mcp/tools/wait-button.js";

describe("gamepad_wait_button MCP tool", () => {
  let server: McpServer;
  let registeredHandler: (args: Record<string, unknown>) => Promise<unknown>;

  beforeEach(() => {
    vi.clearAllMocks();

    server = {
      tool: vi.fn((_name: string, _desc: string, _schema: unknown, handler: unknown) => {
        registeredHandler = handler as typeof registeredHandler;
      }),
    } as unknown as McpServer;

    registerWaitButtonTool(server);
  });

  it("should register the tool with correct name", () => {
    expect(server.tool).toHaveBeenCalledWith(
      "gamepad_wait_button",
      expect.any(String),
      expect.any(Object),
      expect.any(Function),
    );
  });

  it("should return error when no controller connected", async () => {
    mockIsConnected.mockReturnValue(false);

    const result = await registeredHandler({ timeout: 5000 });
    const parsed = JSON.parse((result as any).content[0].text);

    expect(parsed.error).toBe("No controller connected");
    expect((result as any).isError).toBe(true);
  });

  it("should resolve with button press result", async () => {
    mockIsConnected.mockReturnValue(true);
    mockWaitForButton.mockResolvedValue({ button: "a", player: 0 });

    const result = await registeredHandler({ button: "a", timeout: 5000 });
    const parsed = JSON.parse((result as any).content[0].text);

    expect(mockWaitForButton).toHaveBeenCalledWith("a", 5000);
    expect(parsed.button).toBe("a");
    expect(parsed.player).toBe(0);
  });

  it("should wait for any button when none specified", async () => {
    mockIsConnected.mockReturnValue(true);
    mockWaitForButton.mockResolvedValue({ button: "x", player: 0 });

    const result = await registeredHandler({ timeout: 10000 });
    const parsed = JSON.parse((result as any).content[0].text);

    expect(mockWaitForButton).toHaveBeenCalledWith(undefined, 10000);
    expect(parsed.button).toBe("x");
  });

  it("should return error on timeout", async () => {
    mockIsConnected.mockReturnValue(true);
    mockWaitForButton.mockRejectedValue(
      new Error("Timeout waiting for button press (5000ms)"),
    );

    const result = await registeredHandler({ timeout: 5000 });
    const parsed = JSON.parse((result as any).content[0].text);

    expect(parsed.error).toBe("Timeout waiting for button press (5000ms)");
    expect((result as any).isError).toBe(true);
  });
});
