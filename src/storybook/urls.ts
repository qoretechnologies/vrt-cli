const normalizeBase = (baseUrl: string): string => baseUrl.replace(/\/$/, '');

export const buildStoryUrl = (baseUrl: string, storyId: string): string => {
  const normalized = normalizeBase(baseUrl);
  const encoded = encodeURIComponent(storyId);
  return `${normalized}/iframe.html?id=${encoded}`;
};
