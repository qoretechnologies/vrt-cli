import type { QlipRuntimeConfig } from './types.js';

declare global {
  var __QLIP_CONFIG__: QlipRuntimeConfig | undefined;
  var __vitest_browser__: unknown;
}

export {};
