export interface QlipViewport {
  width: number;
  height: number;
}

export interface QlipParameters {
  skip?: boolean;
  viewport?: QlipViewport;
}

export interface QlipPluginOptions {
  outputDir?: string;
  buildId?: string;
  viewport?: QlipViewport;
}

export interface QlipResolvedDefaults {
  outputDir: string;
  viewport: QlipViewport;
  skip: boolean;
}

export interface QlipRuntimeConfig {
  buildId: string;
  outputDir: string;
  buildDir: string;
  defaults: QlipResolvedDefaults;
  tool: { name: string; version: string };
}

export interface QlipScreenshotOptions {
  name?: string;
  skip?: boolean;
  viewport?: QlipViewport;
}

export interface QlipStoryContext {
  id?: string;
  title?: string;
  name?: string;
  parameters?: { qlip?: QlipParameters };
}

export type QlipEntryKind = 'auto' | 'manual';
export type QlipEntryStatus = 'captured' | 'skipped' | 'failed';

export interface QlipManifestEntry {
  kind: QlipEntryKind;
  storyId: string;
  storyTitle?: string;
  storyName?: string;
  screenshotName: string;
  path: string;
  viewport: QlipViewport;
  status: QlipEntryStatus;
  error: { message: string; stack?: string } | null;
  timings: { ms: number };
}

export interface QlipManifest {
  tool: { name: string; version: string };
  buildId: string;
  createdAt: string;
  outputDir: string;
  defaults: QlipResolvedDefaults;
  stats: {
    storiesTotal: number;
    capturedAuto: number;
    capturedManual: number;
    skipped: number;
    failed: number;
    durationMs: number;
  };
  entries: QlipManifestEntry[];
}
