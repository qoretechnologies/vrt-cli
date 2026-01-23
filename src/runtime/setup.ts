import { afterEach } from 'vitest';
import { captureAutoScreenshot, captureErrorScreenshot } from './screenshot.js';
import { getRuntimeState, initRuntimeState } from './context.js';

const isBrowser = () => typeof globalThis.__vitest_browser__ !== 'undefined';

if (isBrowser()) {
  initRuntimeState();
  afterEach(async (context) => {
    await captureAutoScreenshot(context);
    const runtime = getRuntimeState();
    if (
      runtime &&
      context.task.result?.state === 'fail'
    ) {
      await captureErrorScreenshot(context);
    }
  });
}
