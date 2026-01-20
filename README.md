# vrt

Local-first Storybook visual capture CLI. Runs against an existing Storybook instance, takes Playwright Chromium screenshots for every story, and writes a manifest alongside the images. No cloud or upload steps.

## Install

```bash
npm install -g @vrt/vrt
# or
npm install --save-dev @vrt/vrt
```

## Usage

1. Start your Storybook locally (e.g. `npm run storybook`).
2. Run capture:

```bash
vrt capture --url http://localhost:6006 --out ./.vrt --concurrency 4 --timeout 30000 --viewport 1280x720 --wait 200
```

### Options

- `--url` Storybook base URL (default `http://localhost:6006`).
- `--out` Output directory (default `./.vrt`).
- `--concurrency` Concurrent pages (default `4`).
- `--timeout` Navigation timeout in ms (default `30000`).
- `--viewport` `WIDTHxHEIGHT` viewport (default `1280x720`).
- `--wait` Extra ms after load before screenshot (default `200`).
- `--headful` Run browser with UI (default headless).
- `--full-page` Capture full page (default viewport only).
- `--include` One or more substrings to keep matching storyIds.
- `--exclude` One or more substrings to skip storyIds.
- `--build-id` Override the timestamp-based build folder name.

### Output layout

```
.vrt/
  screenshots/
    <buildId>/
      <storyId>.png
      manifest.json
```

`buildId` defaults to `YYYYMMDD-HHmmss` (UTC). Story IDs are sanitized for filenames. The manifest stores tool info, base URL, options used, timing and status for each story, and relative screenshot paths.

### Exit codes

- `0` when discovery succeeds and at least one story is captured (even if some fail).
- `1` when discovery fails or every story capture fails.

### Filtering

Use `--include` to keep only storyIds containing any provided substrings, and `--exclude` to drop storyIds containing any provided substrings. Includes are applied before excludes.

## Troubleshooting

- **Storybook endpoints not found**: The CLI tries `/index.json`, then `/storybook-index.json`, then `/stories.json`. Ensure Storybook is running and reachable.
- **CORS or HTTPS**: Use the full Storybook URL and consider `--headful` if your app requires user fonts or permissions.
- **Slow loading stories**: Increase `--timeout` or `--wait` to allow late fonts/layouts before capturing.
- **Playwright missing dependencies**: Install system deps listed in the Playwright docs (mostly for Linux CI).

## Tests

- Unit tests (discovery, parsing, paths, manifest, filtering) run with `npm test`.
- Optional integration test (real Playwright + tiny HTTP server): enable with `VRT_E2E=1 npm test`.
