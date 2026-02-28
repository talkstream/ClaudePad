import { EventEmitter } from "node:events";
import { InputBuffer } from "./input-buffer.js";
import type { ButtonName } from "./types.js";
import { logger } from "../utils/logger.js";

export interface ComboDefinition {
  name: string;
  sequence: ButtonName[];
  windowMs: number;
  description: string;
  level: "novice" | "advanced" | "master";
}

export const DEFAULT_COMBOS: ComboDefinition[] = [
  {
    name: "quick_approve",
    sequence: ["a", "a"],
    windowMs: 300,
    description: 'Approve with "proceed"',
    level: "novice",
  },
  {
    name: "turbo_mode",
    sequence: ["leftshoulder", "rightshoulder"],
    windowMs: 200,
    description: "Toggle auto-approve",
    level: "advanced",
  },
  {
    name: "hadouken",
    sequence: ["dpdown", "dpright", "a"],
    windowMs: 500,
    description: "Commit + push",
    level: "master",
  },
  {
    name: "shoryuken",
    sequence: ["dpright", "dpdown", "dpright", "b"],
    windowMs: 600,
    description: "Reset conversation",
    level: "master",
  },
  {
    name: "konami",
    sequence: [
      "dpup",
      "dpup",
      "dpdown",
      "dpdown",
      "dpleft",
      "dpright",
      "dpleft",
      "dpright",
      "b",
      "a",
    ],
    windowMs: 3000,
    description: "Easter egg: rainbow rumble",
    level: "master",
  },
];

export class ComboDetector extends EventEmitter {
  private buffer: InputBuffer;
  private combos: ComboDefinition[];

  constructor(combos?: ComboDefinition[]) {
    super();
    this.buffer = new InputBuffer(20);
    this.combos = combos ?? [...DEFAULT_COMBOS];
  }

  recordInput(button: ButtonName): ComboDefinition | null {
    this.buffer.push(button);

    // Check each combo from longest to shortest for priority
    const sorted = [...this.combos].sort(
      (a, b) => b.sequence.length - a.sequence.length,
    );

    for (const combo of sorted) {
      if (this.checkCombo(combo)) {
        logger.log(`Combo detected: ${combo.name} (${combo.description})`);
        this.buffer.clear();
        this.emit("combo:detected", combo);
        return combo;
      }
    }

    return null;
  }

  private checkCombo(combo: ComboDefinition): boolean {
    const recent = this.buffer.getRecent(combo.windowMs);
    if (recent.length < combo.sequence.length) return false;

    // Check the last N inputs match the combo sequence
    const tail = recent.slice(-combo.sequence.length);
    return tail.every((event, i) => event.button === combo.sequence[i]);
  }

  addCombo(combo: ComboDefinition): void {
    this.combos.push(combo);
  }

  getCombos(): ComboDefinition[] {
    return [...this.combos];
  }
}
