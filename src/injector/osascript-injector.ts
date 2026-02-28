import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { KeystrokeInjector } from "./keystroke-injector.js";
import { isAccessibilityEnabled } from "../utils/terminal-detect.js";
import { logger } from "../utils/logger.js";

const execFileAsync = promisify(execFile);

// Map of special key names to AppleScript key codes
const KEY_CODE_MAP: Record<string, string> = {
  Enter: "return",
  Escape: "escape",
  Tab: "tab",
  Up: "up arrow",
  Down: "down arrow",
  Left: "left arrow",
  Right: "right arrow",
};

export class OsascriptInjector implements KeystrokeInjector {
  readonly name = "osascript";

  isAvailable(): boolean {
    return process.platform === "darwin" && isAccessibilityEnabled();
  }

  async sendKeys(keys: string): Promise<void> {
    // Handle Ctrl+key combos
    const ctrlMatch = keys.match(/^C-(.+)$/);
    if (ctrlMatch) {
      const key = ctrlMatch[1];
      const script = `tell application "System Events" to keystroke "${key}" using control down`;
      logger.debug(`osascript: ${script}`);
      await execFileAsync("osascript", ["-e", script]);
      return;
    }

    // Handle special keys
    const mapped = KEY_CODE_MAP[keys];
    if (mapped) {
      const script = `tell application "System Events" to keystroke ${mapped}`;
      logger.debug(`osascript: ${script}`);
      await execFileAsync("osascript", ["-e", script]);
      return;
    }

    // Regular character
    const script = `tell application "System Events" to keystroke "${keys}"`;
    logger.debug(`osascript: ${script}`);
    await execFileAsync("osascript", ["-e", script]);
  }

  async sendText(text: string): Promise<void> {
    // Escape double quotes in text
    const escaped = text.replace(/"/g, '\\"');
    const script = `tell application "System Events" to keystroke "${escaped}"`;
    logger.debug(`osascript: ${script}`);
    await execFileAsync("osascript", ["-e", script]);
  }
}
