import { GamepadManager } from "../gamepad/manager.js";
import { HapticFeedbackEngine } from "../haptic/feedback-engine.js";
import { ButtonMapper } from "../config/button-mapper.js";
import { ComboDetector } from "../gamepad/combo-detector.js";
import { loadConfig } from "../config/loader.js";
import { logger } from "../utils/logger.js";
import type { ButtonName } from "../gamepad/types.js";

export class DaemonController {
  private manager: GamepadManager;
  private hapticEngine: HapticFeedbackEngine;
  private buttonMapper!: ButtonMapper;
  private comboDetector: ComboDetector;
  private running = false;

  constructor() {
    this.manager = GamepadManager.getInstance();
    this.hapticEngine = new HapticFeedbackEngine(this.manager);
    this.comboDetector = new ComboDetector();
  }

  async start(): Promise<void> {
    if (this.running) return;

    const config = await loadConfig();
    this.buttonMapper = new ButtonMapper(config.mappings);

    this.manager.start();
    this.running = true;

    this.manager.on("button:press", (button: ButtonName) => {
      const combo = this.comboDetector.recordInput(button);
      if (combo) {
        this.hapticEngine.playPattern("combo_activated");
        if (combo.name === "konami") {
          this.hapticEngine.playPattern("rainbow");
        }
        return;
      }
      this.buttonMapper.handleButton(button);
    });

    this.manager.on("connect", () => {
      logger.log("Controller connected in daemon mode");
      setTimeout(() => this.hapticEngine.playPattern("success"), 500);
    });

    this.manager.on("disconnect", () => {
      logger.log("Controller disconnected, waiting for reconnect...");
    });

    logger.log("Daemon started — buttons mapped, combos armed");
  }

  stop(): void {
    this.manager.stop();
    this.running = false;
    logger.log("Daemon stopped");
  }

  isRunning(): boolean {
    return this.running;
  }
}
