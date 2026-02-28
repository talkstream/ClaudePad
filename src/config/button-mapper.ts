import type { ButtonName } from "../gamepad/types.js";
import type { KeystrokeInjector } from "../injector/keystroke-injector.js";
import { TmuxInjector } from "../injector/tmux-injector.js";
import { OsascriptInjector } from "../injector/osascript-injector.js";
import { DEFAULT_BUTTON_MAP, type ButtonAction } from "./defaults.js";
import { logger } from "../utils/logger.js";

export class ButtonMapper {
  private mapping: Partial<Record<ButtonName, ButtonAction>>;
  private injector: KeystrokeInjector;

  constructor(
    customMapping?: Partial<Record<ButtonName, ButtonAction>>,
    injector?: KeystrokeInjector,
  ) {
    this.mapping = { ...DEFAULT_BUTTON_MAP, ...customMapping };
    this.injector = injector ?? this.detectInjector();
  }

  private detectInjector(): KeystrokeInjector {
    const tmux = new TmuxInjector();
    if (tmux.isAvailable()) {
      logger.log("Using tmux injector");
      return tmux;
    }

    const osascript = new OsascriptInjector();
    if (osascript.isAvailable()) {
      logger.log("Using osascript injector");
      return osascript;
    }

    logger.warn("No keystroke injector available");
    return tmux; // Will fail gracefully when used
  }

  async handleButton(button: ButtonName): Promise<boolean> {
    const action = this.mapping[button];
    if (!action) {
      logger.debug(`No mapping for button: ${button}`);
      return false;
    }

    logger.log(`Button ${button} → ${action.description}`);
    try {
      for (const key of action.keys) {
        await this.injector.sendKeys(key);
      }
      return true;
    } catch (err) {
      logger.error(`Failed to inject keys for ${button}: ${err}`);
      return false;
    }
  }

  getMapping(): Partial<Record<ButtonName, ButtonAction>> {
    return { ...this.mapping };
  }

  setMapping(
    button: ButtonName,
    action: ButtonAction,
  ): void {
    this.mapping[button] = action;
  }

  getInjectorName(): string {
    return this.injector.name;
  }
}
