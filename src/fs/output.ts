import { QlipManifest, QlipResolvedDefaults } from '../types.js';

export const TOOL_NAME = 'qlip';

export const DEFAULT_OUTPUT_DIR = './qlip/screenshots';
export const DEFAULT_VIEWPORT = { width: 1280, height: 720 };

export const generateBuildId = (date: Date = new Date()): string => {
  const pad = (num: number): string => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};

export const sanitizeSegment = (value: string): string =>
  value.trim().replace(/[^a-zA-Z0-9_.-]/g, '_');

export const joinPath = (...parts: string[]): string => {
  const normalized = parts
    .filter((part) => part.length > 0)
    .map((part) => part.replace(/\\/g, '/'));

  if (normalized.length === 0) {
    return '';
  }

  let result = normalized[0];
  for (let index = 1; index < normalized.length; index += 1) {
    const part = normalized[index].replace(/^\/+/, '');
    result = result.replace(/\/+$/, '');
    result = `${result}/${part}`;
  }
  return result;
};

export const buildAutoScreenshotPath = ({
  buildDir,
  storyId,
}: {
  buildDir: string;
  storyId: string;
}) => {
  const safeId = sanitizeSegment(storyId);
  const relativePath = `stories/${safeId}.png`;
  return {
    safeId,
    relativePath,
    absolutePath: joinPath(buildDir, relativePath),
  };
};

export const buildManualScreenshotPath = ({
  buildDir,
  storyId,
  screenshotName,
}: {
  buildDir: string;
  storyId: string;
  screenshotName: string;
}) => {
  const safeId = sanitizeSegment(storyId);
  const safeName = sanitizeSegment(screenshotName);
  const relativePath = `stories/${safeId}/${safeName}.png`;
  return {
    safeId,
    safeName,
    relativePath,
    absolutePath: joinPath(buildDir, relativePath),
  };
};

export const createManifest = ({
  buildId,
  outputDir,
  defaults,
  tool,
  createdAt = new Date(),
}: {
  buildId: string;
  outputDir: string;
  defaults: QlipResolvedDefaults;
  tool: { name: string; version: string };
  createdAt?: Date;
}): QlipManifest => ({
  tool,
  buildId,
  createdAt: createdAt.toISOString(),
  outputDir,
  defaults,
  stats: {
    storiesTotal: 0,
    capturedAuto: 0,
    capturedManual: 0,
    skipped: 0,
    failed: 0,
    durationMs: 0,
  },
  entries: [],
});
