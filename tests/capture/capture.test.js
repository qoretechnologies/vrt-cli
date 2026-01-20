import os from 'node:os';
import path from 'node:path';
import { mkdtemp, readFile } from 'node:fs/promises';
import { describe, it, expect, vi, beforeEach } from 'vitest';
const pageMocks = {
    goto: vi.fn().mockResolvedValue(undefined),
    waitForLoadState: vi.fn().mockResolvedValue(undefined),
    waitForTimeout: vi.fn().mockResolvedValue(undefined),
    screenshot: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
};
const newPage = vi.fn().mockResolvedValue(pageMocks);
const contextMocks = { newPage };
const newContext = vi.fn().mockResolvedValue(contextMocks);
const closeBrowser = vi.fn().mockResolvedValue(undefined);
const launch = vi.fn().mockResolvedValue({ newContext, close: closeBrowser });
vi.mock('playwright', () => ({
    chromium: { launch },
}));
const { captureStories } = await import('../../src/capture/playwrightCapture.js');
const baseOptions = {
    outDir: '',
    concurrency: 2,
    timeout: 5000,
    viewport: { width: 800, height: 600 },
    waitBeforeScreenshot: 0,
    headless: true,
    fullPage: false,
    include: undefined,
    exclude: undefined,
};
describe('captureStories', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('captures stories and writes manifest', async () => {
        const tmp = await mkdtemp(path.join(os.tmpdir(), 'vrt-cap-'));
        const result = await captureStories({
            baseUrl: 'http://localhost:6006',
            stories: [
                { storyId: 'button--primary', title: 'Button', name: 'Primary' },
                { storyId: 'button--secondary', title: 'Button', name: 'Secondary' },
            ],
            options: { ...baseOptions, outDir: tmp, waitBeforeScreenshot: 10 },
        });
        expect(launch).toHaveBeenCalledWith({ headless: true });
        expect(newContext).toHaveBeenCalledWith({ viewport: { width: 800, height: 600 } });
        expect(newPage).toHaveBeenCalledTimes(2);
        expect(pageMocks.screenshot).toHaveBeenCalledTimes(2);
        expect(result.stats.captured).toBe(2);
        const manifest = JSON.parse(await readFile(result.manifestPath, 'utf-8'));
        expect(manifest.stories).toHaveLength(2);
        expect(manifest.stories[0].status).toBe('captured');
    });
    it('records failures but continues', async () => {
        pageMocks.goto.mockRejectedValueOnce(new Error('boom'));
        const tmp = await mkdtemp(path.join(os.tmpdir(), 'vrt-cap-'));
        const result = await captureStories({
            baseUrl: 'http://localhost:6006',
            stories: [
                { storyId: 'button--primary', title: 'Button', name: 'Primary' },
                { storyId: 'button--secondary', title: 'Button', name: 'Secondary' },
            ],
            options: { ...baseOptions, outDir: tmp },
        });
        expect(result.stats.failed).toBe(1);
        expect(result.results.filter((r) => r.status === 'failed')).toHaveLength(1);
    });
});
