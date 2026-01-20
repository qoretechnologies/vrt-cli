import { parseStoryIndex } from './parsers.js';
import { timeoutFetch } from '../utils/timeoutFetch.js';
const ENDPOINTS = ['index.json', 'storybook-index.json', 'stories.json'];
const normalizeBaseUrl = (url) => url.replace(/\/$/, '');
const buildUrl = (baseUrl, endpoint) => `${normalizeBaseUrl(baseUrl)}/${endpoint}`;
export const discoverStories = async (baseUrl, options = {}) => {
    const { fetchImpl, timeoutMs } = options;
    const attempts = [];
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
        const stories = parseStoryIndex(payload);
        if (!stories.length) {
            throw new Error(`No stories found in ${url}`);
        }
        return { baseUrl: normalizeBaseUrl(baseUrl), stories };
    }
    throw new Error(`Could not discover stories. Tried: ${attempts.join(', ')}`);
};
