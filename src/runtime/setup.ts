import { afterEach } from 'vitest';
import { captureAutoScreenshot } from './screenshot.js';
import { initRuntimeState } from './context.js';

const isBrowser = () => typeof globalThis.__vitest_browser__ !== 'undefined';

if (isBrowser()) {
  initRuntimeState();
  afterEach(async (context) => {
    await captureAutoScreenshot(context);
  });
}
