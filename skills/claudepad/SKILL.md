---
name: claudepad
description: Activate/deactivate Xbox gamepad support, check status, configure mappings
---

# ClaudePad Skill

Manage Xbox gamepad integration with Claude Code.

## Commands

- `/claudepad` — Show controller status (connected, battery, current mappings)
- `/claudepad rumble <pattern>` — Test haptic feedback (success, error, warning, task_complete, combo_activated, rainbow)
- `/claudepad map <button> <action>` — Reconfigure button mapping
- `/claudepad combos` — Show all available combo sequences
- `/claudepad test` — Interactive test: press any button on the controller

## Implementation

This skill uses the ClaudePad MCP server tools:

1. **Status check**: Call `gamepad_get_state` tool to get connection and button states
2. **Rumble test**: Call `gamepad_rumble` tool with the specified pattern name
3. **Mapping**: Call `gamepad_configure_mapping` tool with action "get" or "set"
4. **Combos**: Call `gamepad_configure_mapping` with action "get" to list combos
5. **Test**: Call `gamepad_wait_button` tool (blocks until a button is pressed)

## Default Button Mapping

| Button | Action | Description |
|--------|--------|-------------|
| A (green) | y + Enter | Approve tool call |
| B (red) | n + Enter | Deny tool call |
| X (blue) | Ctrl+C | Interrupt |
| Y (yellow) | Escape | Skip |
| LB/RB | Scroll | Page up/down in tmux |
| D-pad Up/Down | Arrows | Navigate |
| Menu | Enter | Confirm |
| View | Ctrl+C | Interrupt |

## Combo Sequences

| Combo | Input | Action |
|-------|-------|--------|
| Quick Approve | A, A (< 300ms) | Fast approve |
| Hadouken | Down, Right, A (< 500ms) | Commit + push |
| Shoryuken | Right, Down, Right, B (< 600ms) | Reset conversation |
| Konami Code | Up Up Down Down Left Right Left Right B A (< 3s) | Rainbow rumble |
