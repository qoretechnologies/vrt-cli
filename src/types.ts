export interface Story {
  storyId: string;
  title?: string;
  name?: string;
}

export interface DiscoverResult {
  baseUrl: string;
  stories: Story[];
}

export interface CaptureOptions {
  url: string;
  outDir: string;
  buildId?: string;
  concurrency: number;
  timeout: number;
  viewport: { width: number; height: number };
  waitBeforeScreenshot: number;
  headless: boolean;
  fullPage: boolean;
  include?: string[];
  exclude?: string[];
}

export interface StoryResult extends Story {
  url: string;
  status: 'captured' | 'failed';
  screenshotPath?: string;
  error?: { message: string; stack?: string } | null;
  timings: { ms: number };
}

export interface CaptureRun {
  buildId: string;
  results: StoryResult[];
  stats: {
    total: number;
    captured: number;
    failed: number;
    durationMs: number;
  };
  manifestPath: string;
}
