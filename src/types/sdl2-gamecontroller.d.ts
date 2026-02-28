declare module "sdl2-gamecontroller" {
  import { EventEmitter } from "events";

  export type Message = { message: string };
  export type Player = { player?: number };
  export type Error = Message & Player & { operation: string };
  export type Warning = Message & {
    operation: string;
    elapsed_ms?: number;
    poll_number?: number;
  };
  export type SdlInit = {
    compiled_against_SDL_version: string;
    linked_against_SDL_version: string;
  };
  export type DeviceAdded = Message &
    Player & {
      which: number;
      name: string;
      vendor_id: number;
      product_id: number;
      serial_number?: string;
      effects_supported: boolean;
      haptic: boolean;
      has_leds?: boolean;
      num_touchpads?: number;
      has_accelerometer?: boolean;
      has_gyroscope?: boolean;
      has_rumble?: boolean;
      has_rumble_trigger?: boolean;
    };
  export type DeviceUpdated = Message & { which: number };
  export type AxisType =
    | "leftx"
    | "lefty"
    | "rightx"
    | "righty"
    | "lefttrigger"
    | "righttrigger";
  export type ButtonType =
    | "a"
    | "b"
    | "x"
    | "y"
    | "back"
    | "guide"
    | "start"
    | "leftstick"
    | "misc1"
    | "rightstick"
    | "leftshoulder"
    | "rightshoulder"
    | "dpup"
    | "dpdown"
    | "dpright"
    | "dpleft";
  export type AxisMotionData = Message &
    Player & { button: AxisType; value: number; timestamp: number };
  export type ButtonPress = Message &
    Player & { button: ButtonType; pressed: boolean };
  export type ButtonTypeWithUpsAndDowns =
    | `${ButtonType}:up`
    | `${ButtonType}:down`
    | ButtonType
    | "controller-button-up"
    | "controller-button-down";
  export type BatteryLevelType =
    | "empty"
    | "low"
    | "medium"
    | "full"
    | "wired"
    | "max"
    | "unknown";
  export type BatteryUpdate = Message &
    DeviceUpdated & { timestamp: number; level: BatteryLevelType };

  export type CallBack<T = Record<string, unknown>> = (data: T) => void;

  export interface Gamecontroller extends EventEmitter {
    enableGyroscope: (enable?: boolean, player?: number) => void;
    enableAccelerometer: (enable?: boolean, player?: number) => void;
    setLeds: (
      red?: number,
      green?: number,
      blue?: number,
      player?: number,
    ) => void;
    rumble: (
      low_frequency_rumble?: number,
      high_frequency_rumble?: number,
      duration_ms?: number,
      player?: number,
    ) => void;
    rumbleTriggers: (
      left_rumble?: number,
      right_rumble?: number,
      duration_ms?: number,
      player?: number,
    ) => void;
    pollEvents: () => void;
    on(event: string, listener: (...args: any[]) => void): this;
  }

  export interface GameControllerOptions {
    interval?: number;
    fps?: number;
    sdl_joystick_rog_chakram?: boolean;
  }

  export function createController(
    options?: GameControllerOptions,
  ): Gamecontroller;
  const defaultController: Gamecontroller;
  export default defaultController;
}
