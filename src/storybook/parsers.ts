import { Story } from '../types.js';

type IndexShape = {
  entries?: Record<string, StoryEntry>;
  stories?: Record<string, StoryEntry> | StoryEntry[];
};

type StoryEntry = {
  id?: string;
  storyId?: string;
  title?: string;
  kind?: string;
  name?: string;
};

const normalizeEntry = (
  entry: StoryEntry,
  fallbackId?: string,
): Story | null => {
  const storyId = entry.id || entry.storyId || fallbackId;
  if (!storyId || typeof storyId !== 'string') return null;

  const title = entry.title || entry.kind;
  const name = entry.name;

  return { storyId, title: title || undefined, name: name || undefined };
};

export const parseStoryIndex = (data: unknown): Story[] => {
  if (!data || typeof data !== 'object') return [];

  const { entries, stories } = data as IndexShape;

  if (entries && typeof entries === 'object') {
    return Object.entries(entries)
      .map(([key, value]) => normalizeEntry(value, key))
      .filter((item): item is Story => Boolean(item));
  }

  if (Array.isArray(stories)) {
    return stories
      .map((value) => normalizeEntry(value))
      .filter((item): item is Story => Boolean(item));
  }

  if (stories && typeof stories === 'object') {
    return Object.entries(stories)
      .map(([key, value]) => normalizeEntry(value as StoryEntry, key))
      .filter((item): item is Story => Boolean(item));
  }

  return [];
};
