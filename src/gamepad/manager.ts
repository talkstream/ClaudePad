import { EventEmitter } from "node:events";
import { createRequire } from "node:module";
import type {
  Gamecontroller,
  AxisType,
  ButtonPress,
  AxisMotionData,
  DeviceAdded,
} from "sdl2-gamecontroller";

// SDL2 on macOS requires a video driver; dummy driver works for headless CLI
process.env.SDL_VIDEODRIVER ??= "dummy";

// Redirect console.log before loading sdl2-gamecontroller
// because the module creates a default controller at load time and logs to stdout
const _origConsoleLog = console.log;
console.log = (...args: unknown[]) =>
  process.stderr.write(`[sdl2] ${args.map(String).join(" ")}\n`);

const require = createRequire(import.meta.url);
const sdl2Module = require("sdl2-gamecontroller") as typeof import("sdl2-gamecontroller");

console.log = _origConsoleLog;

import { logger } from "../utils/logger.js";
import {
  ALL_BUTTONS,
  ALL_AXES,
  type ButtonName,
  type AxisName,
  type GamepadState,
  type ControllerInfo,
} from "./types.js";

export interface GamepadManagerEvents {
  "button:press": (button: ButtonName, player: number) => void;
  "button:release": (button: ButtonName, player: number) => void;
  "axis:move": (axis: AxisName, value: number, player: number) => void;
  connect: (info: ControllerInfo) => void;
  disconnect: (player: number) => void;
}

export class GamepadManager extends EventEmitter {
  private static instance: GamepadManager | null = null;
  private controller: Gamecontroller | null = null;
  private controllerInfo: ControllerInfo | null = null;
  private buttonStates: Map<ButtonName, boolean> = new Map();
  private axisValues: Map<AxisName, number> = new Map();
  private connected = false;
  private batteryLevel: string | null = null;

  private constructor() {
    super();
    this.initStates();
  }

  static getInstance(): GamepadManager {
    if (!GamepadManager.instance) {
      GamepadManager.instance = new GamepadManager();
    }
    return GamepadManager.instance;
  }

  private initStates(): void {
    for (const button of ALL_BUTTONS) {
      this.buttonStates.set(button, false);
    }
    for (const axis of ALL_AXES) {
      this.axisValues.set(axis, 0);
    }
  }

  start(): void {
    if (this.controller) return;

    // Use the default controller — sdl2-gamecontroller creates one at module load
    // and starts polling. Creating a second one causes SDL_PollEvent race conditions
    // (events are consumed by whichever instance polls first).
    this.controller = sdl2Module.default;

    this.setupEventListeners();
    logger.log("GamepadManager started (using default SDL2 controller, polling at ~30fps)");
  }

  stop(): void {
    if (this.controller) {
      this.controller.removeAllListeners();
      this.controller = null;
    }
    this.connected = false;
    this.controllerInfo = null;
    logger.log("GamepadManager stopped");
  }

  private setupEventListeners(): void {
    const ctrl = this.controller!;

    ctrl.on("sdl-init", (data) => {
      logger.log(
        `SDL2 initialized: compiled=${data.compiled_against_SDL_version}, linked=${data.linked_against_SDL_version}`,
      );
    });

    ctrl.on("controller-device-added", (data: DeviceAdded) => {
      this.connected = true;
      this.controllerInfo = {
        name: data.name,
        player: data.player ?? 0,
        vendorId: data.vendor_id,
        productId: data.product_id,
        hasRumble: data.has_rumble ?? false,
        hasRumbleTrigger: data.has_rumble_trigger ?? false,
        hasLeds: data.has_leds ?? false,
      };
      logger.log(`Controller connected: ${data.name} (player ${data.player})`);
      this.emit("connect", this.controllerInfo);
    });

    ctrl.on("controller-device-removed", () => {
      this.connected = false;
      const player = this.controllerInfo?.player ?? 0;
      this.controllerInfo = null;
      this.initStates();
      logger.log("Controller disconnected");
      this.emit("disconnect", player);
    });

    ctrl.on("controller-button-down", (data: ButtonPress) => {
      const button = data.button as ButtonName;
      this.buttonStates.set(button, true);
      this.emit("button:press", button, data.player ?? 0);
    });

    ctrl.on("controller-button-up", (data: ButtonPress) => {
      const button = data.button as ButtonName;
      this.buttonStates.set(button, false);
      this.emit("button:release", button, data.player ?? 0);
    });

    for (const axis of ALL_AXES) {
      ctrl.on(axis as AxisType, (data: AxisMotionData) => {
        this.axisValues.set(axis, data.value);
        this.emit("axis:move", axis, data.value, data.player ?? 0);
      });
    }

    ctrl.on("controller-battery-update", (data) => {
      this.batteryLevel = data.level;
    });

    ctrl.on("error", (data) => {
      logger.error(`SDL2 error: ${data.message} (${data.operation})`);
    });

    ctrl.on("warning", (data) => {
      logger.warn(`SDL2 warning: ${data.message} (${data.operation})`);
    });
  }

  getState(): GamepadState {
    const buttons = {} as GamepadState["buttons"];
    const now = Date.now();
    for (const button of ALL_BUTTONS) {
      buttons[button] = {
        pressed: this.buttonStates.get(button) ?? false,
        timestamp: now,
      };
    }

    const axes = {} as GamepadState["axes"];
    for (const axis of ALL_AXES) {
      axes[axis] = {
        value: this.axisValues.get(axis) ?? 0,
        timestamp: now,
      };
    }

    return {
      connected: this.connected,
      name: this.controllerInfo?.name ?? null,
      player: this.controllerInfo?.player ?? null,
      buttons,
      axes,
      hasRumble: this.controllerInfo?.hasRumble ?? false,
      batteryLevel: this.batteryLevel,
    };
  }

  isConnected(): boolean {
    return this.connected;
  }

  getControllerInfo(): ControllerInfo | null {
    return this.controllerInfo;
  }

  rumble(
    lowFrequency: number,
    highFrequency: number,
    durationMs: number,
  ): void {
    if (!this.controller || !this.connected) {
      logger.warn("Cannot rumble: no controller connected");
      return;
    }
    this.controller.rumble(
      lowFrequency,
      highFrequency,
      durationMs,
      this.controllerInfo?.player,
    );
  }

  rumbleTriggers(
    leftRumble: number,
    rightRumble: number,
    durationMs: number,
  ): void {
    if (!this.controller || !this.connected) return;
    this.controller.rumbleTriggers(
      leftRumble,
      rightRumble,
      durationMs,
      this.controllerInfo?.player,
    );
  }

  waitForButton(
    button?: ButtonName,
    timeoutMs: number = 30000,
  ): Promise<{ button: ButtonName; player: number }> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.removeListener("button:press", handler);
        reject(new Error(`Timeout waiting for button press (${timeoutMs}ms)`));
      }, timeoutMs);

      const handler = (pressed: ButtonName, player: number) => {
        if (!button || pressed === button) {
          clearTimeout(timer);
          this.removeListener("button:press", handler);
          resolve({ button: pressed, player });
        }
      };

      this.on("button:press", handler);
    });
  }
}
