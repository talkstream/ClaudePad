import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ButtonMapper } from "../../config/button-mapper.js";
import { ComboDetector } from "../../gamepad/combo-detector.js";
import { ALL_BUTTONS } from "../../gamepad/types.js";

export function registerConfigureTool(
  server: McpServer,
  buttonMapper: ButtonMapper,
  comboDetector: ComboDetector,
): void {
  server.tool(
    "gamepad_configure_mapping",
    "View or update button-to-action mappings",
    {
      action: z
        .enum(["get", "set"])
        .describe("get: view current mappings, set: update a mapping"),
      button: z
        .enum(ALL_BUTTONS as [string, ...string[]])
        .optional()
        .describe("Button to configure (required for set)"),
      keys: z
        .array(z.string())
        .optional()
        .describe('Keys to send when button is pressed (e.g. ["y", "Enter"])'),
      description: z
        .string()
        .optional()
        .describe("Human-readable description of the action"),
    },
    async ({ action, button, keys, description }) => {
      if (action === "get") {
        const mappings = buttonMapper.getMapping();
        const combos = comboDetector.getCombos();

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  injector: buttonMapper.getInjectorName(),
                  mappings,
                  combos: combos.map((c) => ({
                    name: c.name,
                    sequence: c.sequence.join(" → "),
                    window: `${c.windowMs}ms`,
                    description: c.description,
                    level: c.level,
                  })),
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      if (!button || !keys) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: "button and keys are required for 'set' action",
              }),
            },
          ],
          isError: true,
        };
      }

      buttonMapper.setMapping(button as any, {
        keys,
        description: description ?? keys.join(" + "),
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              success: true,
              button,
              keys,
              description: description ?? keys.join(" + "),
            }),
          },
        ],
      };
    },
  );
}
