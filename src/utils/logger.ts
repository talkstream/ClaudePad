// MCP servers use stdout for JSON-RPC. All logging MUST go to stderr.
const log = (...args: unknown[]) => {
  process.stderr.write(`[claudepad] ${args.map(String).join(" ")}\n`);
};

const error = (...args: unknown[]) => {
  process.stderr.write(`[claudepad:error] ${args.map(String).join(" ")}\n`);
};

const warn = (...args: unknown[]) => {
  process.stderr.write(`[claudepad:warn] ${args.map(String).join(" ")}\n`);
};

const debug = (...args: unknown[]) => {
  if (process.env.CLAUDEPAD_DEBUG) {
    process.stderr.write(`[claudepad:debug] ${args.map(String).join(" ")}\n`);
  }
};

export const logger = { log, error, warn, debug };
