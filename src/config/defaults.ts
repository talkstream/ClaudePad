import type { ButtonName } from "../gamepad/types.js";

export interface ButtonAction {
  // Keys to send via injector (tmux send-keys format)
  keys: string[];
  description: string;
}

export type ButtonMapping = Record<string, ButtonAction>;

// Default button-to-keystroke mapping for Claude Code interaction
export const DEFAULT_BUTTON_MAP: Partial<Record<ButtonName, ButtonAction>> = {
  a: {
    keys: ["y", "Enter"],
    description: "Approve (yes + Enter)",
  },
  b: {
    keys: ["n", "Enter"],
    description: "Deny (no + Enter)",
  },
  x: {
    keys: ["C-c"],
    description: "Interrupt (Ctrl+C)",
  },
  y: {
    keys: ["Escape"],
    description: "Skip (Escape)",
  },
  leftshoulder: {
    keys: ["C-b", "PPage"],
    description: "Scroll up (tmux page up)",
  },
  rightshoulder: {
    keys: ["C-b", "NPage"],
    description: "Scroll down (tmux page down)",
  },
  dpup: {
    keys: ["Up"],
    description: "Arrow up",
  },
  dpdown: {
    keys: ["Down"],
    description: "Arrow down",
  },
  start: {
    keys: ["Enter"],
    description: "Enter",
  },
  back: {
    keys: ["C-c"],
    description: "Interrupt (Ctrl+C)",
  },
  guide: {
    keys: ["/voice", "Enter"],
    description: "Toggle voice input (/voice)",
  },
  leftstick: {
    keys: ["Tab"],
    description: "Tab (autocomplete)",
  },
  rightstick: {
    keys: ["/", "Enter"],
    description: "Slash command menu",
  },
  dpleft: {
    keys: ["Left"],
    description: "Cursor left",
  },
  dpright: {
    keys: ["Right"],
    description: "Cursor right",
  },
};
