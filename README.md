# ClaudePad

> *"Coding never changes. But your input device just did."*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Model_Context_Protocol-blueviolet)](https://modelcontextprotocol.io/)
[![Xbox Controller](https://img.shields.io/badge/Xbox-Wireless_Controller-107C10?logo=xbox&logoColor=white)](https://www.xbox.com/)
[![macOS](https://img.shields.io/badge/macOS-000000?logo=apple&logoColor=white)](https://www.apple.com/macos/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/claudepad)](https://www.npmjs.com/package/claudepad)

**Vibe-code from your couch.** Connect your Xbox Wireless Controller to [Claude Code](https://docs.anthropic.com/en/docs/claude-code) via MCP. Approve with **A**, deny with **B**, interrupt with **X**. Execute fighting game combos to commit+push. Feel haptic feedback when Claude finishes thinking.

## Install

### Prerequisites

macOS + SDL2:

```sh
brew install cmake sdl2
```

### Add to Claude Code (one-liner)

```sh
claude mcp add claudepad -- npx -y claudepad
```

That's it. Restart Claude Code and connect your Xbox controller via Bluetooth.

### Verify controller

```sh
npx claudepad-test
```

## Button Map

| Button | Action | Description |
|--------|--------|-------------|
| **A** (green) | Approve | `y` + Enter |
| **B** (red) | Deny | `n` + Enter |
| **X** (blue) | Interrupt | Ctrl+C |
| **Y** (yellow) | Skip | Escape |
| **LB** | Scroll Up | tmux page up |
| **RB** | Scroll Down | tmux page down |
| **D-pad** | Navigate | Arrow keys |
| **Menu** | Confirm | Enter |
| **View** | Interrupt | Ctrl+C |
| **Xbox** | Voice Input | `/voice` + Enter |
| **L3** | Autocomplete | Tab |
| **R3** | Slash Commands | `/` |

## Combos

Fighting game input sequences trigger special actions:

| Combo | Sequence | Window | Action |
|-------|----------|--------|--------|
| **Hadouken** | Down, Right, A | 500ms | `git commit` + `push` |
| **Shoryuken** | Right, Down, Right, B | 600ms | Reset conversation |
| **Quick Approve** | A, A | 300ms | Double approve |
| **Turbo Mode** | LB + RB | 200ms | Toggle turbo |
| **Konami Code** | Up Up Down Down Left Right Left Right B A | 3s | Rainbow rumble |

## Haptic Feedback

Your controller vibrates to communicate state — no need to look at the screen.

| Pattern | Feel | When |
|---------|------|------|
| `success` | Gentle double pulse | Task completed |
| `error` | Hard long buzz | Something broke |
| `warning` | Medium single pulse | Heads up |
| `approval_prompt` | Triple tap rhythm | Claude needs input |
| `task_complete` | Rising crescendo | Major milestone |
| `combo_activated` | Sharp snap | Combo detected |
| `voice_start` | Light click | Voice recording started |
| `rainbow` | Wave crescendo | Easter egg activated |

## Architecture

```
Xbox Controller --Bluetooth--> macOS SDL2 --> GamepadManager
                                                  |
                                        +---------+---------+
                                        |                   |
                                   ButtonMapper       ComboDetector
                                        |
                                  KeystrokeInjector
                                   (tmux / osascript)
                                        |
                                    Claude Code
```

## MCP Tools

When running as an MCP server, Claude gains access to:

| Tool | Description |
|------|-------------|
| `gamepad_get_state` | Read button/axis/connection state |
| `gamepad_wait_button` | Block until a specific button press |
| `gamepad_get_analog` | Read analog stick and trigger values |
| `gamepad_rumble` | Send haptic feedback (preset or custom) |
| `gamepad_wait_combo` | Wait for a combo input |
| `gamepad_configure_mapping` | View or update button mappings |

## Daemon Mode

Run standalone (no MCP, just keystrokes):

```sh
npx tsx src/daemon.ts
```

Or install as a persistent launchd service:

```sh
cp com.claudepad.daemon.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.claudepad.daemon.plist
```

## Development

```sh
npm test              # Run tests
npm run test:watch    # Watch mode
npm run dev           # Dev mode with file watching
```

## Tech Stack

**TypeScript** + **tsx** | **@modelcontextprotocol/sdk** | **sdl2-gamecontroller** (SDL2 native addon) | **zod** | **vitest** | **tmux**

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
