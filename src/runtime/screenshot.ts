import {
  QlipEntryKind,
  QlipEntryStatus,
  QlipScreenshotOptions,
  QlipStoryContext,
  QlipViewport,
} from '../types.js';
import { resolveQlipOptions } from '../config/parameters.js';
import {
  buildAutoScreenshotPath,
  buildManualScreenshotPath,
  joinPath,
  sanitizeSegment,
} from '../fs/output.js';
import {
  initRuntimeState,
  markStorybookWarning,
  nextStepName,
  pushEntry,
  updateStats,
} from './context.js';
import type { TestContext } from 'vitest';

const ensureBrowserContext = async () => {
  if (!globalThis.__vitest_browser__) {
    throw new Error(
      '[qlip] screenshot() can only be used in Vitest Browser Mode.',
    );
  }

  const { page, commands } = await import('@vitest/browser/context');
  if (!page || !commands) {
    throw new Error(
      '[qlip] Playwright page is unavailable. Ensure Storybook Vitest addon is enabled.',
    );
  }
  return { page, commands };
};

const resolveStoryInfo = (ctx: QlipStoryContext) => {
  const storyId = ctx.id ? String(ctx.id) : '';
  return {
    id: storyId,
    title: ctx.title,
    name: ctx.name,
    parameters: ctx.parameters?.qlip,
  };
};

const resolveManualArgs = (
  nameOrOptions?: string | QlipScreenshotOptions,
  options?: QlipScreenshotOptions,
) => {
  if (typeof nameOrOptions === 'string') {
    return { name: nameOrOptions, options };
  }
  return { name: undefined, options: nameOrOptions };
};

const buildEntry = ({
  kind,
  storyId,
  storyTitle,
  storyName,
  screenshotName,
  relativePath,
  viewport,
  status,
  error,
  timingsMs,
}: {
  kind: QlipEntryKind;
  storyId: string;
  storyTitle?: string;
  storyName?: string;
  screenshotName: string;
  relativePath: string;
  viewport: QlipViewport;
  status: QlipEntryStatus;
  error: { message: string; stack?: string } | null;
  timingsMs: number;
}) => ({
  kind,
  storyId,
  storyTitle,
  storyName,
  screenshotName,
  path: relativePath,
  viewport,
  status,
  error,
  timings: { ms: timingsMs },
});

const captureScreenshot = async ({
  kind,
  story,
  screenshotName,
  options,
}: {
  kind: QlipEntryKind;
  story: ReturnType<typeof resolveStoryInfo>;
  screenshotName?: string;
  options?: QlipScreenshotOptions;
}) => {
  const runtime = initRuntimeState();
  if (!runtime) {
    console.warn(
      '[qlip] Runtime config is missing. screenshot() only works in Vitest with qlipVitestPlugin enabled.',
    );
    return;
  }
  const { page, commands } = await ensureBrowserContext();

  if (!story.id) {
    if (!runtime.warnedMissingStorybook) {
      console.warn(
        '[qlip] No story context detected. Qlip only captures Storybook Vitest stories.',
      );
      markStorybookWarning(runtime);
    }
    return;
  }

  const resolved = resolveQlipOptions({
    defaults: runtime.config.defaults,
    story: story.parameters,
    override: options,
  });

  const name =
    kind === 'manual'
      ? sanitizeSegment(screenshotName ?? nextStepName(runtime, story.id))
      : 'auto';

  const captureStart = Date.now();

  if (resolved.skip) {
    pushEntry(
      runtime,
      buildEntry({
        kind,
        storyId: story.id,
        storyTitle: story.title,
        storyName: story.name,
        screenshotName: name,
        relativePath:
          kind === 'manual'
            ? buildManualScreenshotPath({
                buildDir: runtime.config.buildDir,
                storyId: story.id,
                screenshotName: name,
              }).relativePath
            : buildAutoScreenshotPath({
                buildDir: runtime.config.buildDir,
                storyId: story.id,
              }).relativePath,
        viewport: resolved.viewport,
        status: 'skipped',
        error: null,
        timingsMs: Date.now() - captureStart,
      }),
    );
    updateStats(runtime, {
      storiesTotal:
        kind === 'auto'
          ? runtime.manifest.stats.storiesTotal + 1
          : runtime.manifest.stats.storiesTotal,
      skipped: runtime.manifest.stats.skipped + 1,
    });
    await commands.writeFile(
      joinPath(runtime.config.buildDir, 'manifest.json'),
      JSON.stringify(runtime.manifest, null, 2),
      'utf-8',
    );
    return;
  }

  let relativePath = '';
  let absolutePath = '';
  if (kind === 'manual') {
    const pathInfo = buildManualScreenshotPath({
      buildDir: runtime.config.buildDir,
      storyId: story.id,
      screenshotName: name,
    });
    relativePath = pathInfo.relativePath;
    absolutePath = pathInfo.absolutePath;
  } else {
    const pathInfo = buildAutoScreenshotPath({
      buildDir: runtime.config.buildDir,
      storyId: story.id,
    });
    relativePath = pathInfo.relativePath;
    absolutePath = pathInfo.absolutePath;
  }

  let status: QlipEntryStatus = 'captured';
  let error: { message: string; stack?: string } | null = null;
  try {
    await page.viewport(resolved.viewport.width, resolved.viewport.height);
    await page.screenshot({ path: absolutePath, save: true });
  } catch (err) {
    status = 'failed';
    const typedError = err as Error;
    error = {
      message: typedError.message,
      stack: typedError.stack,
    };
  }

  const entry = buildEntry({
    kind,
    storyId: story.id,
    storyTitle: story.title,
    storyName: story.name,
    screenshotName: name,
    relativePath,
    viewport: resolved.viewport,
    status,
    error,
    timingsMs: Date.now() - captureStart,
  });

  pushEntry(runtime, entry);
  if (kind === 'auto') {
    updateStats(runtime, {
      storiesTotal: runtime.manifest.stats.storiesTotal + 1,
      capturedAuto:
        status === 'captured'
          ? runtime.manifest.stats.capturedAuto + 1
          : runtime.manifest.stats.capturedAuto,
      failed:
        status === 'failed'
          ? runtime.manifest.stats.failed + 1
          : runtime.manifest.stats.failed,
    });
  } else {
    updateStats(runtime, {
      capturedManual:
        status === 'captured'
          ? runtime.manifest.stats.capturedManual + 1
          : runtime.manifest.stats.capturedManual,
      failed:
        status === 'failed'
          ? runtime.manifest.stats.failed + 1
          : runtime.manifest.stats.failed,
    });
  }

  await commands.writeFile(
    joinPath(runtime.config.buildDir, 'manifest.json'),
    JSON.stringify(runtime.manifest, null, 2),
    'utf-8',
  );
};

export const screenshot = async (
  ctx: QlipStoryContext,
  nameOrOptions?: string | QlipScreenshotOptions,
  options?: QlipScreenshotOptions,
) => {
  const { name, options: resolvedOptions } = resolveManualArgs(
    nameOrOptions,
    options,
  );
  const story = resolveStoryInfo(ctx);
  await captureScreenshot({
    kind: 'manual',
    story,
    screenshotName: name,
    options: resolvedOptions,
  });
};

type QlipTestContext = TestContext & { story?: QlipStoryContext };

export const captureAutoScreenshot = async (ctx: QlipTestContext) => {
  const storyContext = ctx.story ?? {};
  const story = resolveStoryInfo(storyContext);
  const metaStoryId = (ctx.task.meta as { storyId?: string } | undefined)
    ?.storyId;
  if (!story.id && typeof metaStoryId === 'string') {
    story.id = metaStoryId;
  }
  if (!story.name && ctx.task.name) {
    story.name = ctx.task.name;
  }
  if (!story.title && ctx.task.suite?.name) {
    story.title = ctx.task.suite.name;
  }
  await captureScreenshot({
    kind: 'auto',
    story,
  });
};
