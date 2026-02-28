#!/usr/bin/env tsx
// Phase 0: Smoke test — verify Xbox BLE controller is detected by SDL2

import { createController } from "sdl2-gamecontroller";

console.log("ClaudePad Controller Test");
console.log("========================");
console.log("Waiting for controller connection...");
console.log("Press Ctrl+C to exit\n");

const controller = createController({ fps: 30 });

controller.on("sdl-init", (data) => {
  console.log(
    `SDL2 initialized (compiled: ${data.compiled_against_SDL_version}, linked: ${data.linked_against_SDL_version})`,
  );
});

controller.on("controller-device-added", (data) => {
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

controller.on("controller-button-down", (data) => {
  console.log(`Button DOWN: ${data.button} (player ${data.player})`);
  // Send a short rumble on every button press
  controller.rumble(40000, 20000, 150, data.player);
});

controller.on("controller-button-up", (data) => {
  console.log(`Button UP:   ${data.button} (player ${data.player})`);
});

controller.on("error", (data) => {
  console.error(`ERROR: ${data.message} (${data.operation})`);
});

controller.on("warning", (data) => {
  console.warn(`WARN: ${data.message} (${data.operation})`);
});

// Keep process alive
process.on("SIGINT", () => {
  console.log("\nExiting...");
  process.exit(0);
});
