#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./mcp/server.js";
import { logger } from "./utils/logger.js";

async function main(): Promise<void> {
  logger.log("Starting ClaudePad MCP server...");

  const server = await createMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
  logger.log("ClaudePad MCP server running on stdio");
}

main().catch((err) => {
  logger.error(`Fatal: ${err}`);
  process.exit(1);
});
