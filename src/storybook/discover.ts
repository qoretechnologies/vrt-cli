import { DiscoverResult, Story } from '../types.js';
import { timeoutFetch } from '../utils/timeoutFetch.js';
import { parseStoryIndex } from './parsers.js';

interface DiscoverOptions {
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

const ENDPOINTS = ['index.json', 'storybook-index.json', 'stories.json'];

const normalizeBaseUrl = (url: string): string => url.replace(/\/$/, '');

const buildUrl = (baseUrl: string, endpoint: string): string =>
  `${normalizeBaseUrl(baseUrl)}/${endpoint}`;

export const discoverStories = async (
  baseUrl: string,
  options: DiscoverOptions = {},
): Promise<DiscoverResult> => {
  const { fetchImpl, timeoutMs } = options;
  const attempts: string[] = [];

  for (const endpoint of ENDPOINTS) {
    const url = buildUrl(baseUrl, endpoint);
    attempts.push(url);

    const response = await timeoutFetch(url, { fetchImpl, timeoutMs });

    if (response.status === 404) {
      continue;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url} (status ${response.status})`);
    }

    const payload = await response.json();
    const stories: Story[] = parseStoryIndex(payload);

    if (!stories.length) {
      throw new Error(`No stories found in ${url}`);
    }

    return { baseUrl: normalizeBaseUrl(baseUrl), stories };
  }

  throw new Error(`Could not discover stories. Tried: ${attempts.join(', ')}`);
};
