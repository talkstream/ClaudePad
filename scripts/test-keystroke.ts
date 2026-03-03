#!/usr/bin/env tsx
// Test keystroke injection via tmux or osascript

import { TmuxInjector } from "../src/injector/tmux-injector.js";
import { OsascriptInjector } from "../src/injector/osascript-injector.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  console.log("ClaudePad Keystroke Injection Test");
  console.log("==================================\n");

  const tmux = new TmuxInjector();
  const osascript = new OsascriptInjector();

  console.log(`tmux available: ${tmux.isAvailable()}`);
  console.log(`osascript available: ${osascript.isAvailable()}\n`);

  const injector = tmux.isAvailable() ? tmux : osascript;

  if (!injector.isAvailable()) {
    console.error(
      "No injector available. Run inside tmux or enable Accessibility.",
    );
    process.exit(1);
  }

  console.log(`Using: ${injector.name}\n`);

  // Test 1: sendText (clipboard-based for osascript, layout-safe)
  console.log('Test 1: sendText("hello from ClaudePad!") in 3 seconds...');
  await sleep(3000);
  await injector.sendText("hello from ClaudePad!");
  console.log("  Sent!\n");

  // Test 2: sendKeys with special keys
  console.log("Test 2: sendKeys(Enter) in 2 seconds...");
  await sleep(2000);
  await injector.sendKeys("Enter");
  console.log("  Sent!\n");

  console.log("Done! Check the terminal for injected text.");
}

main().catch(console.error);
