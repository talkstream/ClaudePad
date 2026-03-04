#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const entry = join(__dirname, "..", "src", "index.ts");

execFileSync(
  process.execPath,
  ["--import", "tsx", entry],
  { stdio: "inherit", env: { ...process.env, NODE_NO_WARNINGS: "1" } },
);
