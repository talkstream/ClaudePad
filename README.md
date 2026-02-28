# ClaudePad

Xbox Gamepad MCP Server for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — approve tool calls with **A**, deny with **B**, get haptic feedback, and unleash fighting game combos.

## What is this?

ClaudePad connects your Xbox Wireless Controller (Bluetooth) to Claude Code CLI as an alternative input device. Think of it as a couch-friendly way to interact with your AI coding assistant.

**Key features:**
- **Button-to-action mapping** — A = approve, B = deny, X = interrupt, Y = skip
- **Haptic feedback** — feel when tasks complete, errors occur, or combos activate
- **Fighting game combos** — Hadouken (↓→A) to commit+push, Konami Code for easter eggs
- **MCP integration** — Claude can read controller state, wait for input, trigger rumble
- **Daemon mode** — always-on button mapping without MCP, with launchd auto-start

## Requirements

- macOS (Apple Silicon or Intel)
- Xbox Wireless Controller (Bluetooth)
- [SDL2](https://www.libsdl.org/) 2.0.16+
- Node.js 18+
- [tmux](https://github.com/tmux/tmux) (primary) or macOS Accessibility (fallback) for keystroke injection

### Install prerequisites

```sh
brew install cmake sdl2
```

## Quick Start

```sh
git clone https://github.com/nafigator/ClaudePad.git
cd ClaudePad
npm install
```

### 1. Smoke test (verify controller detection)

```sh
npx tsx scripts/test-controller.ts
```

Press buttons on your Xbox controller — you should see button names printed and feel a short rumble on each press.

### 2. Test haptic patterns

```sh
npx tsx scripts/test-rumble.ts
```

### 3. Test keystroke injection

Inside a tmux session:
```sh
npx tsx scripts/test-keystroke.ts
```

### 4. Run as MCP server (with Claude Code)

Add to your Claude Code project's `.mcp.json`:

```json
{
  "mcpServers": {
    "claudepad": {
      "type": "stdio",
      "command": "npx",
      "args": ["tsx", "src/index.ts"],
      "cwd": "/path/to/ClaudePad"
    }
  }
}
```

Then start Claude Code — the `claudepad` MCP server will be available.

### 5. Daemon mode (standalone)

```sh
npx tsx src/daemon.ts
```

Or install as a launchd service:
```sh
cp com.claudepad.daemon.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.claudepad.daemon.plist
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `gamepad_get_state` | Get current button/axis/connection state |
| `gamepad_wait_button` | Block until a specific button is pressed |
| `gamepad_get_analog` | Read analog stick and trigger values |
| `gamepad_rumble` | Send haptic feedback with preset or custom patterns |
| `gamepad_wait_combo` | Wait for a fighting game combo input |
| `gamepad_configure_mapping` | View or update button-to-action mappings |

## Button Mapping

| Button | Action | Description |
|--------|--------|-------------|
| **A** (green) | `y` + Enter | Approve tool call |
| **B** (red) | `n` + Enter | Deny tool call |
| **X** (blue) | Ctrl+C | Interrupt |
| **Y** (yellow) | Escape | Skip |
| **LB / RB** | Page Up/Down | Scroll in tmux |
| **D-pad ↑↓** | Arrow keys | Navigate |
| **Menu** | Enter | Confirm |
| **View** | Ctrl+C | Interrupt |

## Combo System

Inspired by fighting games — input sequences within a time window trigger special actions.

| Combo | Input | Window | Action | Level |
|-------|-------|--------|--------|-------|
| Quick Approve | A, A | 300ms | Fast approve | Novice |
| Turbo Mode | LB + RB | 200ms | Toggle auto-approve | Advanced |
| Hadouken | ↓ → A | 500ms | Commit + push | Master |
| Shoryuken | → ↓ → B | 600ms | Reset conversation | Master |
| Konami Code | ↑↑↓↓←→←→BA | 3s | Rainbow rumble | Master |

## Haptic Patterns

| Pattern | Feel | Use case |
|---------|------|----------|
| `success` | Gentle double pulse | Task completed |
| `error` | Hard long buzz | Error occurred |
| `warning` | Medium single pulse | Warning |
| `approval_prompt` | Triple tap rhythm | Waiting for approval |
| `task_complete` | Rising crescendo | Major milestone |
| `combo_activated` | Sharp snap | Combo detected |
| `rainbow` | Wave crescendo | Easter egg |

## Development

```sh
npm test              # Run tests
npm run test:watch    # Watch mode
npm run dev           # Dev mode with file watching
```

## Project Structure

```
src/
├── index.ts              # MCP server entry point
├── daemon.ts             # Daemon mode entry point
├── mcp/
│   ├── server.ts         # MCP server setup
│   ├── tools/            # MCP tool handlers
│   └── resources/        # MCP resource providers
├── gamepad/
│   ├── manager.ts        # GamepadManager singleton
│   ├── combo-detector.ts # Fighting game combo system
│   ├── input-buffer.ts   # Circular input buffer
│   └── types.ts          # Type definitions
├── injector/
│   ├── keystroke-injector.ts  # Strategy interface
│   ├── tmux-injector.ts       # tmux send-keys
│   └── osascript-injector.ts  # macOS AppleScript
├── haptic/
│   ├── feedback-engine.ts # Haptic playback engine
│   └── patterns.ts        # Preset vibration patterns
├── config/
│   ├── button-mapper.ts   # Button → action mapping
│   ├── defaults.ts        # Default mappings
│   └── loader.ts          # Config file loader
├── daemon/
│   └── controller.ts      # Daemon mode controller
└── utils/
    ├── logger.ts          # stderr logger (MCP-safe)
    └── terminal-detect.ts # tmux/accessibility detection
```

## Tech Stack

- **TypeScript** + **tsx** runtime
- **@modelcontextprotocol/sdk** — MCP server (stdio transport)
- **sdl2-gamecontroller** — SDL2 gamepad + rumble via native addon
- **zod** — MCP tool input validation
- **vitest** — testing
- **tmux** — keystroke injection (primary)

## License

MIT
