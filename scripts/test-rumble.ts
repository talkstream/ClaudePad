#!/usr/bin/env tsx
// Test all haptic patterns sequentially

process.env.SDL_VIDEODRIVER ??= "dummy";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sdl2 = require("sdl2-gamecontroller") as typeof import("sdl2-gamecontroller");

import { HAPTIC_PATTERNS } from "../src/haptic/patterns.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log("ClaudePad Rumble Test");
console.log("====================");
console.log("Connect controller and wait...\n");

const controller = sdl2.default;

controller.on("controller-device-added", async (data: any) => {
  console.log(`Controller: ${data.name}`);
  console.log(`Rumble supported: ${data.has_rumble}\n`);

  for (const [name, pattern] of Object.entries(HAPTIC_PATTERNS)) {
    console.log(`Playing pattern: ${name}`);
    for (const step of pattern.steps) {
      controller.rumble(step.low, step.high, step.duration, data.player);
      await sleep(step.duration + step.pause);
    }
    await sleep(500);
  }

  console.log("\nAll patterns played!");
  process.exit(0);
});

controller.on("error", (data: any) => {
  console.error(`ERROR: ${data.message}`);
});

setTimeout(() => {
  console.error("No controller connected after 10s");
  process.exit(1);
}, 10000);
