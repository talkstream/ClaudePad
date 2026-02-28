import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GamepadManager } from "../../gamepad/manager.js";

export function registerGetStateTool(server: McpServer): void {
  server.tool("gamepad_get_state", "Get current gamepad state (buttons, axes, connection status)", {}, async () => {
    const manager = GamepadManager.getInstance();
    const state = manager.getState();

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(state, null, 2),
        },
      ],
    };
  });
}
