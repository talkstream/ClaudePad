#!/usr/bin/env tsx
// Test keystroke injection via tmux or osascript

import { TmuxInjector } from "../src/injector/tmux-injector.js";
import { OsascriptInjector } from "../src/injector/osascript-injector.js";

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

  console.log(`Using: ${injector.name}`);
  console.log('Sending "hello" in 3 seconds...\n');

  await new Promise((resolve) => setTimeout(resolve, 3000));
  await injector.sendText("hello from ClaudePad!");

  console.log("Done!");
}

main().catch(console.error);
