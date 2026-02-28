#!/usr/bin/env node
import { DaemonController } from "./daemon/controller.js";
import { logger } from "./utils/logger.js";

const daemon = new DaemonController();

async function main(): Promise<void> {
  logger.log("Starting ClaudePad daemon mode...");
  await daemon.start();

  process.on("SIGINT", () => {
    logger.log("Received SIGINT, shutting down...");
    daemon.stop();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    logger.log("Received SIGTERM, shutting down...");
    daemon.stop();
    process.exit(0);
  });
}

main().catch((err) => {
  logger.error(`Fatal: ${err}`);
  process.exit(1);
});
