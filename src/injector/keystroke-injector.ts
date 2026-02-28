export interface KeystrokeInjector {
  readonly name: string;
  isAvailable(): boolean;
  sendKeys(keys: string): Promise<void>;
  sendText(text: string): Promise<void>;
}
