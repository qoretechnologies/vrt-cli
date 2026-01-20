const normalizeEntry = (entry, fallbackId) => {
    const storyId = entry.id || entry.storyId || fallbackId;
    if (!storyId || typeof storyId !== 'string')
        return null;
    const title = entry.title || entry.kind;
    const name = entry.name;
    return { storyId, title: title || undefined, name: name || undefined };
};
export const parseStoryIndex = (data) => {
    if (!data || typeof data !== 'object')
        return [];
    const { entries, stories } = data;
    if (entries && typeof entries === 'object') {
        return Object.entries(entries)
            .map(([key, value]) => normalizeEntry(value, key))
            .filter((item) => Boolean(item));
    }
    if (Array.isArray(stories)) {
        return stories
            .map((value) => normalizeEntry(value))
            .filter((item) => Boolean(item));
    }
    if (stories && typeof stories === 'object') {
        return Object.entries(stories)
            .map(([key, value]) => normalizeEntry(value, key))
            .filter((item) => Boolean(item));
    }
    return [];
};
