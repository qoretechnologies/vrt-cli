import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import pkg from '../../package.json' with { type: 'json' };
const TOOL_NAME = 'vrt';
const TOOL_VERSION = pkg.version || '0.0.0';
export const generateBuildId = (date = new Date()) => {
    const pad = (num) => String(num).padStart(2, '0');
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};
export const sanitizeStoryId = (storyId) => storyId.replace(/[^a-zA-Z0-9_.-]/g, '_');
export const buildPaths = (outDir, buildId, storyId) => {
    const buildDir = path.resolve(outDir, 'screenshots', buildId);
    const manifestPath = path.join(buildDir, 'manifest.json');
    if (!storyId) {
        return { buildDir, manifestPath };
    }
    const safeId = sanitizeStoryId(storyId);
    const filename = `${safeId}.png`;
    const screenshotPath = path.join(buildDir, filename);
    const screenshotRelativePath = path.posix.join('screenshots', buildId, filename);
    return { buildDir, manifestPath, screenshotPath, screenshotRelativePath };
};
export const ensureDir = async (dir) => mkdir(dir, { recursive: true });
export const createManifest = ({ baseUrl, buildId, options, stories, stats, createdAt = new Date(), }) => ({
    tool: { name: TOOL_NAME, version: TOOL_VERSION },
    baseUrl,
    buildId,
    createdAt: createdAt.toISOString(),
    options,
    stats,
    stories,
});
export const writeManifest = async (manifestPath, manifest) => {
    await ensureDir(path.dirname(manifestPath));
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    return manifestPath;
};
