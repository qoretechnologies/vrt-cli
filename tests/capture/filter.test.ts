import { describe, expect, it } from 'vitest';
import { filterStories } from '../../src/capture/filterStories.js';

const baseStories = [
  { storyId: 'button--primary' },
  { storyId: 'button--secondary' },
  { storyId: 'input--default' },
];

describe('filterStories', () => {
  it('returns all when no filters provided', () => {
    expect(filterStories(baseStories, undefined, undefined)).toEqual(
      baseStories,
    );
  });

  it('applies include filters as substring match', () => {
    expect(filterStories(baseStories, ['button'], undefined)).toEqual([
      { storyId: 'button--primary' },
      { storyId: 'button--secondary' },
    ]);
  });

  it('applies exclude filters', () => {
    expect(filterStories(baseStories, undefined, ['secondary'])).toEqual([
      { storyId: 'button--primary' },
      { storyId: 'input--default' },
    ]);
  });

  it('combines include then exclude', () => {
    expect(filterStories(baseStories, ['button'], ['secondary'])).toEqual([
      { storyId: 'button--primary' },
    ]);
  });
});
