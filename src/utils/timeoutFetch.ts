export interface TimeoutFetchOptions extends RequestInit {
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export async function timeoutFetch(
  url: string,
  options: TimeoutFetchOptions = {},
): Promise<Response> {
  const { timeoutMs = 5000, fetchImpl = fetch, ...init } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(new Error(`Fetch timed out after ${timeoutMs}ms`)),
    timeoutMs,
  );

  try {
    const response = await fetchImpl(url, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && /aborted/i.test(error.message)) {
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
