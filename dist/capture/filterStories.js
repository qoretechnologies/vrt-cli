const matchesAny = (value, patterns) => {
    if (!patterns || !patterns.length)
        return true;
    return patterns.some((pattern) => value.includes(pattern));
};
export const filterStories = (stories, include, exclude) => {
    const included = stories.filter((story) => matchesAny(story.storyId, include));
    return included.filter((story) => !(exclude && exclude.some((pattern) => story.storyId.includes(pattern))));
};
