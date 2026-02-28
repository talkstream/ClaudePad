import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GamepadManager } from "../../gamepad/manager.js";
import { HapticFeedbackEngine } from "../../haptic/feedback-engine.js";
import { HAPTIC_PATTERNS, type RumbleStep } from "../../haptic/patterns.js";

export function registerRumbleTool(
  server: McpServer,
  hapticEngine: HapticFeedbackEngine,
): void {
  const patternNames = Object.keys(HAPTIC_PATTERNS) as [string, ...string[]];

  server.tool(
    "gamepad_rumble",
    "Send haptic feedback (vibration) to the gamepad",
    {
      pattern: z
        .enum(patternNames)
        .optional()
        .describe(
          `Preset pattern: ${patternNames.join(", ")}`,
        ),
      custom: z
        .array(
          z.object({
            low: z.number().min(0).max(65535),
            high: z.number().min(0).max(65535),
            duration: z.number().positive(),
            pause: z.number().min(0),
          }),
        )
        .optional()
        .describe("Custom rumble steps (overrides pattern)"),
    },
    async ({ pattern, custom }) => {
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

      try {
        if (custom) {
          await hapticEngine.playCustom(custom as RumbleStep[]);
        } else if (pattern) {
          await hapticEngine.playPattern(pattern);
        } else {
          // Default to a simple short rumble
          manager.rumble(30000, 15000, 200);
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                pattern: pattern ?? (custom ? "custom" : "default"),
              }),
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
