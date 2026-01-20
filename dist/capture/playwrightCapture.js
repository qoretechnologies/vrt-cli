import pLimit from 'p-limit';
import { chromium } from 'playwright';
import { buildStoryUrl } from '../storybook/urls.js';
import { filterStories } from './filterStories.js';
import { buildPaths, createManifest, ensureDir, generateBuildId, writeManifest } from '../fs/output.js';
export const captureStories = async ({ baseUrl, stories, options }) => {
    const buildId = options.buildId || generateBuildId();
    const filteredStories = filterStories(stories, options.include, options.exclude);
    if (!filteredStories.length) {
        throw new Error('No stories to capture after applying filters');
    }
    const paths = buildPaths(options.outDir, buildId);
    await ensureDir(paths.buildDir);
    const browser = await chromium.launch({ headless: options.headless });
    const context = await browser.newContext({ viewport: options.viewport });
    const limiter = pLimit(options.concurrency);
    const results = new Array(filteredStories.length);
    const runStart = Date.now();
    await Promise.all(filteredStories.map((story, index) => limiter(async () => {
        const storyPaths = buildPaths(options.outDir, buildId, story.storyId);
        const url = buildStoryUrl(baseUrl, story.storyId);
        const start = Date.now();
        let page;
        try {
            page = await context.newPage();
            await page.goto(url, { waitUntil: 'networkidle', timeout: options.timeout });
            // Wait for the story root to be visible
            await page.locator('#storybook-root').waitFor({ state: 'visible', timeout: options.timeout }).catch(() => {
                // If storybook-root doesn't exist, just continue
            });
            // Wait for Storybook preview to report play completion if available
            await page
                .waitForFunction(() => {
                const preview = window.__STORYBOOK_PREVIEW__;
                const render = preview?.currentRender;
                const phase = render?.phase || render?.renderPhase;
                return phase === 'completed' || phase === 'rendered';
            }, { timeout: options.timeout })
                .catch(() => {
                // Fall back to timed wait
            });
            if (options.waitBeforeScreenshot > 0) {
                await page.waitForTimeout(options.waitBeforeScreenshot);
            }
            await page.screenshot({ path: storyPaths.screenshotPath, fullPage: options.fullPage });
            results[index] = {
                ...story,
                url,
                status: 'captured',
                screenshotPath: storyPaths.screenshotRelativePath,
                error: null,
                timings: { ms: Date.now() - start },
            };
        }
        catch (error) {
            const err = error;
            results[index] = {
                ...story,
                url,
                status: 'failed',
                error: { message: err.message, stack: err.stack },
                timings: { ms: Date.now() - start },
            };
        }
        finally {
            if (page) {
                await page.close();
            }
        }
    })));
    await browser.close();
    const durationMs = Date.now() - runStart;
    const captured = results.filter((r) => r.status === 'captured').length;
    const failed = results.filter((r) => r.status === 'failed').length;
    const stats = { total: filteredStories.length, captured, failed, durationMs };
    const manifest = createManifest({
        baseUrl,
        buildId,
        options,
        stories: results,
        stats,
    });
    await writeManifest(paths.manifestPath, manifest);
    return { buildId, results, stats, manifestPath: paths.manifestPath };
};
