# Contributing to ClaudePad

Thanks for your interest in contributing! Here's how to get started.

## Setup

```sh
git clone https://github.com/talkstream/ClaudePad.git
cd ClaudePad
npm install
```

### Prerequisites

- macOS (Apple Silicon or Intel)
- Node.js 18+
- SDL2: `brew install cmake sdl2`
- Optional: Xbox Wireless Controller (Bluetooth)

## Testing Without a Controller

You don't need a physical gamepad to contribute. The test suite mocks all SDL2 interactions:

```sh
npm test
```

All MCP tool tests, combo detector tests, and haptic pattern tests run without hardware.

If you want to test with a real controller:
```sh
npx tsx scripts/test-controller.ts
```

## Development Workflow

1. Fork the repo and create a feature branch
2. Make your changes
3. Run the full test suite: `npm test`
4. Submit a pull request

## Code Style

- TypeScript strict mode
- All code comments in English
- Use the existing patterns — check similar files before creating new ones
- Logging goes to stderr (stdout is reserved for MCP protocol)

## What to Contribute

- **New haptic patterns** — add to `src/haptic/patterns.ts`
- **New combos** — add to `src/gamepad/combo-detector.ts`
- **New button mappings** — add to `src/config/defaults.ts`
- **Controller support** — test with DualSense, Switch Pro, etc.
- **Platform support** — Linux, Windows (SDL2 is cross-platform)
- **Bug fixes** — always welcome

## Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- macOS version
- Controller model
- Steps to reproduce
- Expected vs actual behavior

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
