#!/usr/bin/env tsx
// Phase 0: Smoke test — verify Xbox BLE controller is detected by SDL2

// SDL2 requires a video driver on macOS; dummy driver works headless
process.env.SDL_VIDEODRIVER ??= "dummy";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sdl2 = require("sdl2-gamecontroller") as typeof import("sdl2-gamecontroller");

// Use the default controller — it's created at module load and owns the SDL event loop.
// Creating a second one via createController() causes event race conditions.
const controller = sdl2.default;

console.log("ClaudePad Controller Test");
console.log("========================");
console.log("Waiting for controller connection...");
console.log("Press Ctrl+C to exit\n");

controller.on("sdl-init", (data: any) => {
  console.log(
    `SDL2 initialized (compiled: ${data.compiled_against_SDL_version}, linked: ${data.linked_against_SDL_version})`,
  );
});

controller.on("controller-device-added", (data: any) => {
  console.log("\n--- Controller Connected ---");
  console.log(`  Name:          ${data.name}`);
  console.log(`  Player:        ${data.player}`);
  console.log(`  Vendor ID:     0x${data.vendor_id.toString(16)}`);
  console.log(`  Product ID:    0x${data.product_id.toString(16)}`);
  console.log(`  Rumble:        ${data.has_rumble ? "YES" : "no"}`);
  console.log(`  Trigger Rumble:${data.has_rumble_trigger ? "YES" : "no"}`);
  console.log(`  LEDs:          ${data.has_leds ? "YES" : "no"}`);
  console.log("\nPress any button to test (rumble on press)...\n");
});

controller.on("controller-device-removed", () => {
  console.log("\n--- Controller Disconnected ---");
});

controller.on("controller-button-down", (data: any) => {
  console.log(`Button DOWN: ${data.button} (player ${data.player})`);
  controller.rumble(40000, 20000, 150, data.player);
});

controller.on("controller-button-up", (data: any) => {
  console.log(`Button UP:   ${data.button} (player ${data.player})`);
});

// Axis events: sticks and triggers
// Deadzone filter to avoid flooding with tiny stick drift
const AXIS_DEADZONE = 3000;
const axisNames = ["leftx", "lefty", "rightx", "righty", "lefttrigger", "righttrigger"];
for (const axis of axisNames) {
  controller.on(axis, (data: any) => {
    if (Math.abs(data.value) > AXIS_DEADZONE) {
      console.log(`Axis ${data.button.padEnd(13)}: ${data.value.toString().padStart(6)}`);
    }
  });
}

controller.on("error", (data: any) => {
  console.error(`ERROR: ${data.message} (${data.operation})`);
});

controller.on("warning", (data: any) => {
  console.warn(`WARN: ${data.message} (${data.operation})`);
});

process.on("SIGINT", () => {
  console.log("\nExiting...");
  process.exit(0);
});
