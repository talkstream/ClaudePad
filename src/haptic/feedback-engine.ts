import { GamepadManager } from "../gamepad/manager.js";
import { HAPTIC_PATTERNS, type RumbleStep, type PatternName } from "./patterns.js";
import { logger } from "../utils/logger.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class HapticFeedbackEngine {
  private manager: GamepadManager;
  private playing = false;

  constructor(manager: GamepadManager) {
    this.manager = manager;
  }

  async playPattern(name: PatternName): Promise<void> {
    const pattern = HAPTIC_PATTERNS[name];
    if (!pattern) {
      logger.warn(`Unknown haptic pattern: ${name}`);
      return;
    }
    await this.playSteps(pattern.steps);
  }

  async playCustom(steps: RumbleStep[]): Promise<void> {
    await this.playSteps(steps);
  }

  private async playSteps(steps: RumbleStep[]): Promise<void> {
    if (this.playing) {
      logger.debug("Haptic pattern already playing, skipping");
      return;
    }

    if (!this.manager.isConnected()) {
      logger.warn("Cannot play haptic: no controller connected");
      return;
    }

    this.playing = true;
    try {
      for (const step of steps) {
        this.manager.rumble(step.low, step.high, step.duration);
        await sleep(step.duration + step.pause);
      }
    } finally {
      this.playing = false;
    }
  }

  getPatternNames(): string[] {
    return Object.keys(HAPTIC_PATTERNS);
  }

  isPlaying(): boolean {
    return this.playing;
  }
}
