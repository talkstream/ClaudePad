import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GamepadManager } from "../../gamepad/manager.js";
import {
  ComboDetector,
  type ComboDefinition,
} from "../../gamepad/combo-detector.js";
import type { ButtonName } from "../../gamepad/types.js";

export function registerWaitComboTool(
  server: McpServer,
  comboDetector: ComboDetector,
): void {
  server.tool(
    "gamepad_wait_combo",
    "Wait for a combo input sequence (fighting game style)",
    {
      timeout: z
        .number()
        .positive()
        .default(10000)
        .describe("Timeout in milliseconds (default 10s)"),
    },
    async ({ timeout }) => {
      const manager = GamepadManager.getInstance();

      if (!manager.isConnected()) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: "No controller connected" }),
            },
          ],
          isError: true,
        };
      }

      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          comboDetector.removeListener("combo:detected", handler);
          manager.removeListener("button:press", inputHandler);
          resolve({
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ error: "Timeout waiting for combo" }),
              },
            ],
            isError: true,
          });
        }, timeout);

        const handler = (combo: ComboDefinition) => {
          clearTimeout(timer);
          comboDetector.removeListener("combo:detected", handler);
          manager.removeListener("button:press", inputHandler);
          resolve({
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  combo: combo.name,
                  description: combo.description,
                  level: combo.level,
                }),
              },
            ],
          });
        };

        const inputHandler = (button: ButtonName) => {
          comboDetector.recordInput(button);
        };

        comboDetector.on("combo:detected", handler);
        manager.on("button:press", inputHandler);
      });
    },
  );
}
