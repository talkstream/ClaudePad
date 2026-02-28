import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import type { ButtonName } from "../gamepad/types.js";
import type { ButtonAction } from "./defaults.js";
import { logger } from "../utils/logger.js";

const CONFIG_DIR = join(homedir(), ".claudepad");
const MAPPINGS_FILE = join(CONFIG_DIR, "mappings.json");

export interface ClaudePadConfig {
  mappings?: Partial<Record<ButtonName, ButtonAction>>;
  hapticEnabled?: boolean;
  injector?: "tmux" | "osascript" | "auto";
  tmuxPane?: string;
}

export async function loadConfig(): Promise<ClaudePadConfig> {
  try {
    const data = await readFile(MAPPINGS_FILE, "utf-8");
    return JSON.parse(data) as ClaudePadConfig;
  } catch {
    logger.debug("No config file found, using defaults");
    return {};
  }
}

export async function saveConfig(config: ClaudePadConfig): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
  await writeFile(MAPPINGS_FILE, JSON.stringify(config, null, 2), "utf-8");
  logger.log(`Config saved to ${MAPPINGS_FILE}`);
}
