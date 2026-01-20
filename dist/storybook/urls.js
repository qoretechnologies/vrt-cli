const normalizeBase = (baseUrl) => baseUrl.replace(/\/$/, '');
export const buildStoryUrl = (baseUrl, storyId) => {
    const normalized = normalizeBase(baseUrl);
    const encoded = encodeURIComponent(storyId);
    return `${normalized}/iframe.html?id=${encoded}`;
};
