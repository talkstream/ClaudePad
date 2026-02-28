export type ButtonName =
  | "a"
  | "b"
  | "x"
  | "y"
  | "back"
  | "guide"
  | "start"
  | "leftstick"
  | "rightstick"
  | "leftshoulder"
  | "rightshoulder"
  | "dpup"
  | "dpdown"
  | "dpleft"
  | "dpright";

export type AxisName =
  | "leftx"
  | "lefty"
  | "rightx"
  | "righty"
  | "lefttrigger"
  | "righttrigger";

export interface ButtonState {
  pressed: boolean;
  timestamp: number;
}

export interface AxisState {
  value: number;
  timestamp: number;
}

export interface GamepadState {
  connected: boolean;
  name: string | null;
  player: number | null;
  buttons: Record<ButtonName, ButtonState>;
  axes: Record<AxisName, AxisState>;
  hasRumble: boolean;
  batteryLevel: string | null;
}

export interface ControllerInfo {
  name: string;
  player: number;
  vendorId: number;
  productId: number;
  hasRumble: boolean;
  hasRumbleTrigger: boolean;
  hasLeds: boolean;
}

export const ALL_BUTTONS: ButtonName[] = [
  "a",
  "b",
  "x",
  "y",
  "back",
  "guide",
  "start",
  "leftstick",
  "rightstick",
  "leftshoulder",
  "rightshoulder",
  "dpup",
  "dpdown",
  "dpleft",
  "dpright",
];

export const ALL_AXES: AxisName[] = [
  "leftx",
  "lefty",
  "rightx",
  "righty",
  "lefttrigger",
  "righttrigger",
];
