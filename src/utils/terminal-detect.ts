import { execFileSync } from "node:child_process";

export function isTmuxSession(): boolean {
  return !!process.env.TMUX;
}

export function getTmuxPane(): string | null {
  if (!isTmuxSession()) return null;
  try {
    return execFileSync("tmux", ["display-message", "-p", "#{pane_id}"], {
      encoding: "utf-8",
    }).trim();
  } catch {
    return null;
  }
}

export function isAccessibilityEnabled(): boolean {
  try {
    const result = execFileSync(
      "osascript",
      ["-e", 'tell application "System Events" to return true'],
      { encoding: "utf-8", timeout: 3000 },
    );
    return result.trim() === "true";
  } catch {
    return false;
  }
}
