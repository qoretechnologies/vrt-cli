import { describe, it, expect, vi } from 'vitest';
import storybookIndexFixture from '../fixtures/storybook/storybook-index.json';
import storiesFixture from '../fixtures/storybook/stories.json';
import { discoverStories } from '../../src/storybook/discover.js';
describe('discoverStories', () => {
    it('tries endpoints in order and succeeds on storybook-index.json after index.json 404', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({ ok: false, status: 404 })
            .mockResolvedValueOnce({ ok: true, status: 200, json: async () => storybookIndexFixture });
        const result = await discoverStories('http://localhost:6006', { fetchImpl: fetchMock });
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock.mock.calls[0][0]).toContain('index.json');
        expect(fetchMock.mock.calls[1][0]).toContain('storybook-index.json');
        expect(result.stories.length).toBe(2);
    });
    it('falls back to stories.json', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({ ok: false, status: 404 })
            .mockResolvedValueOnce({ ok: false, status: 404 })
            .mockResolvedValueOnce({ ok: true, status: 200, json: async () => storiesFixture });
        const result = await discoverStories('http://localhost:6006', { fetchImpl: fetchMock });
        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(fetchMock.mock.calls[2][0]).toContain('stories.json');
        expect(result.stories[0].storyId).toBe('component-d--primary');
    });
    it('throws when all endpoints fail', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 404 });
        await expect(discoverStories('http://localhost:6006', { fetchImpl: fetchMock })).rejects.toThrow(/Could not discover stories/);
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });
    it('throws when no stories returned', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ stories: {} }) });
        await expect(discoverStories('http://localhost:6006', { fetchImpl: fetchMock })).rejects.toThrow(/No stories found/);
    });
});
