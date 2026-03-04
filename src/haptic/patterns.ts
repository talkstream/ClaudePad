export interface RumbleStep {
  low: number;
  high: number;
  duration: number;
  pause: number;
}

export interface HapticPattern {
  name: string;
  steps: RumbleStep[];
}

// Intensity values: 0-65535 (uint16 range for SDL2 rumble)

export const HAPTIC_PATTERNS: Record<string, HapticPattern> = {
  success: {
    name: "success",
    steps: [
      { low: 20000, high: 10000, duration: 200, pause: 100 },
      { low: 20000, high: 10000, duration: 200, pause: 0 },
    ],
  },

  error: {
    name: "error",
    steps: [{ low: 55000, high: 55000, duration: 500, pause: 0 }],
  },

  warning: {
    name: "warning",
    steps: [{ low: 35000, high: 25000, duration: 300, pause: 0 }],
  },

  approval_prompt: {
    name: "approval_prompt",
    steps: [
      { low: 15000, high: 10000, duration: 100, pause: 80 },
      { low: 15000, high: 10000, duration: 100, pause: 80 },
      { low: 15000, high: 10000, duration: 100, pause: 0 },
    ],
  },

  task_complete: {
    name: "task_complete",
    steps: [
      { low: 10000, high: 5000, duration: 150, pause: 100 },
      { low: 25000, high: 15000, duration: 150, pause: 100 },
      { low: 45000, high: 30000, duration: 250, pause: 0 },
    ],
  },

  combo_activated: {
    name: "combo_activated",
    steps: [{ low: 65000, high: 65000, duration: 50, pause: 0 }],
  },

  voice_start: {
    name: "voice_start",
    steps: [{ low: 12000, high: 8000, duration: 80, pause: 0 }],
  },

  rainbow: {
    name: "rainbow",
    steps: [
      { low: 10000, high: 5000, duration: 100, pause: 50 },
      { low: 20000, high: 15000, duration: 100, pause: 50 },
      { low: 30000, high: 25000, duration: 100, pause: 50 },
      { low: 40000, high: 35000, duration: 100, pause: 50 },
      { low: 50000, high: 45000, duration: 100, pause: 50 },
      { low: 60000, high: 55000, duration: 150, pause: 50 },
      { low: 50000, high: 45000, duration: 100, pause: 50 },
      { low: 40000, high: 35000, duration: 100, pause: 50 },
      { low: 30000, high: 25000, duration: 100, pause: 50 },
      { low: 20000, high: 15000, duration: 100, pause: 50 },
      { low: 10000, high: 5000, duration: 100, pause: 0 },
    ],
  },
};

export type PatternName = keyof typeof HAPTIC_PATTERNS;
