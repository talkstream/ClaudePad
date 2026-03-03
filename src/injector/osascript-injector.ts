import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { KeystrokeInjector } from "./keystroke-injector.js";
import { isAccessibilityEnabled } from "../utils/terminal-detect.js";
import { logger } from "../utils/logger.js";

const execFileAsync = promisify(execFile);

// macOS virtual key codes for special keys
// See: https://developer.apple.com/documentation/carbon/kVK_Return etc.
const KEY_CODE_MAP: Record<string, number> = {
  Enter: 36,
  Escape: 53,
  Tab: 48,
  Up: 126,
  Down: 125,
  Left: 123,
  Right: 124,
  PPage: 116, // Page Up
  NPage: 121, // Page Down
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

    // Handle special keys via key codes (layout-independent)
    const keyCode = KEY_CODE_MAP[keys];
    if (keyCode !== undefined) {
      const script = `tell application "System Events" to key code ${keyCode}`;
      logger.debug(`osascript: key code ${keyCode} (${keys})`);
      await execFileAsync("osascript", ["-e", script]);
      return;
    }

    // Single character: use keystroke with "using" option for layout-independence
    // For simple ASCII characters like 'y' or 'n', keystroke works fine
    const script = `tell application "System Events" to keystroke "${keys}"`;
    logger.debug(`osascript: ${script}`);
    await execFileAsync("osascript", ["-e", script]);
  }

  async sendText(text: string): Promise<void> {
    // Use clipboard-based injection to avoid keyboard layout issues.
    // "keystroke" sends physical key positions, so "hello" becomes "фддд" on Russian layout.
    // Instead: save clipboard → set clipboard to text → Cmd+V → restore clipboard.
    logger.debug(`osascript: paste text via clipboard (${text.length} chars)`);

    const script = [
      'set savedClip to the clipboard',
      `set the clipboard to "${text.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`,
      'tell application "System Events" to keystroke "v" using command down',
      'delay 0.1',
      'set the clipboard to savedClip',
    ].join("\n");

    await execFileAsync("osascript", ["-e", script]);
  }
}
