import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GamepadManager } from "../../gamepad/manager.js";
import { ALL_BUTTONS } from "../../gamepad/types.js";

export function registerWaitButtonTool(server: McpServer): void {
  server.tool(
    "gamepad_wait_button",
    "Wait for a specific button press on the gamepad (blocking)",
    {
      button: z
        .enum(ALL_BUTTONS as [string, ...string[]])
        .optional()
        .describe("Specific button to wait for, or any button if omitted"),
      timeout: z
        .number()
        .positive()
        .default(30000)
        .describe("Timeout in milliseconds (default 30s)"),
    },
    async ({ button, timeout }) => {
      const manager = GamepadManager.getInstance();

      if (!manager.isConnected()) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: "No controller connected",
              }),
            },
          ],
          isError: true,
        };
      }

      try {
        const result = await manager.waitForButton(
          button as any,
          timeout,
        );
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: err instanceof Error ? err.message : String(err),
              }),
            },
          ],
          isError: true,
        };
      }
    },
  );
}
