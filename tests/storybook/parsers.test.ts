import { describe, expect, it } from 'vitest';
import { parseStoryIndex } from '../../src/storybook/parsers.js';
import indexFixture from '../fixtures/storybook/index.json';
import storiesFixture from '../fixtures/storybook/stories.json';
import storybookIndexFixture from '../fixtures/storybook/storybook-index.json';

describe('parseStoryIndex', () => {
  it('parses index.json entries map', () => {
    const stories = parseStoryIndex(indexFixture);
    expect(stories).toEqual([
      {
        storyId: 'component-a--primary',
        title: 'Component A',
        name: 'Primary',
      },
      {
        storyId: 'component-b--default',
        title: 'Component B',
        name: 'Default',
      },
    ]);
  });

  it('parses storybook-index.json stories map', () => {
    const stories = parseStoryIndex(storybookIndexFixture);
    expect(stories).toEqual([
      {
        storyId: 'component-c--primary',
        title: 'Component C',
        name: 'Primary',
      },
      {
        storyId: 'component-c--secondary',
        title: 'Component C',
        name: 'Secondary',
      },
    ]);
  });

  it('parses legacy stories.json with kind', () => {
    const stories = parseStoryIndex(storiesFixture);
    expect(stories).toEqual([
      {
        storyId: 'component-d--primary',
        title: 'Component D',
        name: 'Primary',
      },
      {
        storyId: 'component-d--tertiary',
        title: 'Component D',
        name: 'Tertiary',
      },
    ]);
  });

  it('uses entry key as fallback storyId', () => {
    const stories = parseStoryIndex({ entries: { foo: { title: 'No ID' } } });
    expect(stories).toEqual([
      { storyId: 'foo', title: 'No ID', name: undefined },
    ]);
  });
});
