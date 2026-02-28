import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { GamepadManager } from "../gamepad/manager.js";
import { HapticFeedbackEngine } from "../haptic/feedback-engine.js";
import { ButtonMapper } from "../config/button-mapper.js";
import { ComboDetector } from "../gamepad/combo-detector.js";
import { registerGetStateTool } from "./tools/get-state.js";
import { registerWaitButtonTool } from "./tools/wait-button.js";
import { registerGetAnalogTool } from "./tools/get-analog.js";
import { registerRumbleTool } from "./tools/rumble.js";
import { registerWaitComboTool } from "./tools/wait-combo.js";
import { registerConfigureTool } from "./tools/configure.js";
import { registerControllerStatusResource } from "./resources/controller-status.js";
import { loadConfig } from "../config/loader.js";
import { logger } from "../utils/logger.js";
import type { ButtonName } from "../gamepad/types.js";

export async function createMcpServer(): Promise<McpServer> {
  const config = await loadConfig();

  const server = new McpServer({
    name: "claudepad",
    version: "0.1.0",
  });

  // Initialize gamepad subsystems
  const manager = GamepadManager.getInstance();
  const hapticEngine = new HapticFeedbackEngine(manager);
  const buttonMapper = new ButtonMapper(config.mappings);
  const comboDetector = new ComboDetector();

  // Start gamepad polling
  manager.start();

  // Wire up button press → keystroke injection + combo detection
  manager.on("button:press", (button: ButtonName) => {
    // Check combos first
    const combo = comboDetector.recordInput(button);
    if (combo) {
      hapticEngine.playPattern("combo_activated");
      // Handle special combos
      if (combo.name === "konami") {
        hapticEngine.playPattern("rainbow");
      }
      return;
    }

    // Regular button mapping
    buttonMapper.handleButton(button);
  });

  // Haptic feedback on controller connect
  manager.on("connect", () => {
    setTimeout(() => hapticEngine.playPattern("success"), 500);
  });

  // Register MCP tools
  registerGetStateTool(server);
  registerWaitButtonTool(server);
  registerGetAnalogTool(server);
  registerRumbleTool(server, hapticEngine);
  registerWaitComboTool(server, comboDetector);
  registerConfigureTool(server, buttonMapper, comboDetector);

  // Register MCP resources
  registerControllerStatusResource(server);

  logger.log("MCP server created with all tools and resources registered");

  return server;
}
