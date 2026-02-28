import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GamepadManager } from "../../gamepad/manager.js";

export function registerControllerStatusResource(server: McpServer): void {
  server.resource(
    "controller-status",
    "claudepad://controller/status",
    { description: "Current controller connection status and info" },
    async () => {
      const manager = GamepadManager.getInstance();
      const info = manager.getControllerInfo();
      const state = manager.getState();

      const status = {
        connected: state.connected,
        controller: info
          ? {
              name: info.name,
              player: info.player,
              vendorId: `0x${info.vendorId.toString(16)}`,
              productId: `0x${info.productId.toString(16)}`,
              hasRumble: info.hasRumble,
              hasRumbleTrigger: info.hasRumbleTrigger,
              hasLeds: info.hasLeds,
            }
          : null,
        battery: state.batteryLevel,
      };

      return {
        contents: [
          {
            uri: "claudepad://controller/status",
            mimeType: "application/json",
            text: JSON.stringify(status, null, 2),
          },
        ],
      };
    },
  );
}
