# Qlip

Qlip is a Storybook screenshot capture tool that plugs into the Storybook Vitest addon. Add one Vitest plugin and every story automatically gets a screenshot after the test finishes. Use `screenshot()` inside a play function to capture intermediate states.

## Install

```bash
npm install --save-dev @qoretechnologies/qlip
```

## Vitest setup

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { qlipVitestPlugin } from '@qoretechnologies/qlip';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
          qlipVitestPlugin(),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
```

## Manual screenshots inside play

Use the existing **"Logged In"** story as a real-world example:

```ts
import { screenshot } from '@qoretechnologies/qlip';

export const LoggedIn = {
  play: async (ctx) => {
    // interactions and assertions...
    await screenshot(ctx, 'after-login');
  },
};
```

## Parameters

Configure screenshots per story via `parameters.qlip`:

```ts
export const LoggedIn = {
  parameters: {
    qlip: {
      skip: false,
      viewport: { width: 1280, height: 720 },
    },
  },
};
```

Options precedence:

1. Explicit options passed to `screenshot()`
2. `parameters.qlip`
3. Plugin defaults

## Output layout

```
./qlip/screenshots/
  <buildId>/
    stories/
      <storyId>.png
      <storyId>/<screenshotName>.png
    manifest.json
```

- `buildId` defaults to `YYYYMMDD-HHmmss`
- `parameters.qlip.skip === true` disables all captures for that story

## Manifest

Each run writes `manifest.json` inside the build folder with tool metadata, defaults, stats, and per-screenshot entries (auto + manual).
