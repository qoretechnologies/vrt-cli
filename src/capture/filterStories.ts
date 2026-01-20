import { Story } from '../types.js';

const matchesAny = (value: string, patterns?: string[]) => {
  if (!patterns || !patterns.length) return true;
  return patterns.some((pattern) => value.includes(pattern));
};

export const filterStories = (
  stories: Story[],
  include?: string[],
  exclude?: string[],
): Story[] => {
  const included = stories.filter((story) =>
    matchesAny(story.storyId, include),
  );
  return included.filter(
    (story) =>
      !(exclude && exclude.some((pattern) => story.storyId.includes(pattern))),
  );
};
