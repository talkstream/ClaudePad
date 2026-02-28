import type { ButtonName } from "./types.js";

export interface InputEvent {
  button: ButtonName;
  timestamp: number;
}

export class InputBuffer {
  private buffer: InputEvent[];
  private maxSize: number;

  constructor(maxSize: number = 20) {
    this.maxSize = maxSize;
    this.buffer = [];
  }

  push(button: ButtonName): void {
    const event: InputEvent = {
      button,
      timestamp: Date.now(),
    };
    this.buffer.push(event);
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift();
    }
  }

  getRecent(windowMs: number): InputEvent[] {
    const cutoff = Date.now() - windowMs;
    return this.buffer.filter((e) => e.timestamp >= cutoff);
  }

  getAll(): InputEvent[] {
    return [...this.buffer];
  }

  clear(): void {
    this.buffer = [];
  }

  get length(): number {
    return this.buffer.length;
  }
}
