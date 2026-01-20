import { describe, it, expect } from 'vitest';
import { buildStoryUrl } from '../../src/storybook/urls.js';
describe('buildStoryUrl', () => {
    it('encodes story id and normalizes base url', () => {
        const url = buildStoryUrl('http://localhost:6006/', 'component/story:one');
        expect(url).toBe('http://localhost:6006/iframe.html?id=component%2Fstory%3Aone');
    });
});
