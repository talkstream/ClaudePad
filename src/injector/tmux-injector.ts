import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { KeystrokeInjector } from "./keystroke-injector.js";
import { isTmuxSession, getTmuxPane } from "../utils/terminal-detect.js";
import { logger } from "../utils/logger.js";

const execFileAsync = promisify(execFile);

export class TmuxInjector implements KeystrokeInjector {
  readonly name = "tmux";
  private pane: string | null = null;

  constructor(pane?: string) {
    this.pane = pane ?? getTmuxPane();
  }

  isAvailable(): boolean {
    return isTmuxSession() && this.pane !== null;
  }

  async sendKeys(keys: string): Promise<void> {
    if (!this.pane) {
      throw new Error("No tmux pane available");
    }
    logger.debug(`tmux send-keys: "${keys}" to pane ${this.pane}`);
    await execFileAsync("tmux", ["send-keys", "-t", this.pane, keys]);
  }

  async sendText(text: string): Promise<void> {
    if (!this.pane) {
      throw new Error("No tmux pane available");
    }
    logger.debug(`tmux send-keys (literal): "${text}" to pane ${this.pane}`);
    await execFileAsync("tmux", [
      "send-keys",
      "-t",
      this.pane,
      "-l",
      text,
    ]);
  }
}
