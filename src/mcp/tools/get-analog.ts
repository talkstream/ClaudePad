import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GamepadManager } from "../../gamepad/manager.js";
import { ALL_AXES } from "../../gamepad/types.js";

export function registerGetAnalogTool(server: McpServer): void {
  server.tool(
    "gamepad_get_analog",
    "Get analog stick and trigger values",
    {
      axis: z
        .enum(ALL_AXES as [string, ...string[]])
        .optional()
        .describe("Specific axis to read, or all axes if omitted"),
    },
    async ({ axis }) => {
      const manager = GamepadManager.getInstance();
      const state = manager.getState();

      const result = axis ? { [axis]: state.axes[axis as keyof typeof state.axes] } : state.axes;

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );
}
