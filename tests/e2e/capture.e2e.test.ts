import { mkdtemp } from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { expect, test } from 'vitest';
import { captureStories } from '../../src/capture/playwrightCapture.js';
import { makeCaptureOptions } from '../../src/commands/capture.js';
import { discoverStories } from '../../src/storybook/discover.js';

const e2e = test.runIf(process.env.VRT_E2E === '1');

e2e('captures two simple stories end-to-end', async () => {
  const server = http.createServer((req, res) => {
    if (req.url === '/index.json') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          entries: {
            'demo--one': { id: 'demo--one', title: 'Demo', name: 'One' },
            'demo--two': { id: 'demo--two', title: 'Demo', name: 'Two' },
          },
        }),
      );
      return;
    }

    if (req.url?.startsWith('/iframe.html')) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<html><body><main><h1>Story</h1></main></body></html>');
      return;
    }

    res.statusCode = 404;
    res.end('not-found');
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Server did not start');
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const discovery = await discoverStories(baseUrl);
  const tmp = await mkdtemp(path.join(os.tmpdir(), 'vrt-e2e-'));
  const options = makeCaptureOptions({
    url: baseUrl,
    out: tmp,
    viewport: '640x480',
  });

  const run = await captureStories({
    baseUrl,
    stories: discovery.stories,
    options,
  });

  expect(run.stats.total).toBe(2);
  expect(run.stats.failed).toBe(0);

  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});
