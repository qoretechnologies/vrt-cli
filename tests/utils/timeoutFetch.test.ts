import { describe, expect, it, vi } from 'vitest';
import { timeoutFetch } from '../../src/utils/timeoutFetch.js';

describe('timeoutFetch', () => {
  it('resolves when fetch completes before timeout', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true } as Response);

    const result = await timeoutFetch('http://example.com', {
      timeoutMs: 1000,
      fetchImpl: mockFetch as unknown as typeof fetch,
    });

    expect(result.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://example.com',
      expect.objectContaining({ signal: expect.anything() }),
    );
  });

  it(
    'rejects when timeout elapses',
    async () => {
      const mockFetch = vi.fn(
        (url: string, init: any) =>
          new Promise<Response>((resolve, reject) => {
            // Listen for abort signal
            if (init?.signal) {
              init.signal.addEventListener('abort', () => {
                reject(new DOMException('Aborted', 'AbortError'));
              });
            }
            // Simulate a fetch that would take forever
            setTimeout(() => resolve({ ok: true } as Response), 10000);
          }),
      );

      const promise = timeoutFetch('http://example.com', {
        timeoutMs: 50,
        fetchImpl: mockFetch as unknown as typeof fetch,
      });

      await expect(promise).rejects.toThrow(/timed out/i);
    },
    { timeout: 1000 },
  );

  it('uses provided init options', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true } as Response);

    await timeoutFetch('http://example.com', {
      timeoutMs: 100,
      method: 'POST',
      headers: { 'x-test': '1' },
      fetchImpl: mockFetch as unknown as typeof fetch,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://example.com',
      expect.objectContaining({
        method: 'POST',
        headers: { 'x-test': '1' },
        signal: expect.anything(),
      }),
    );
  });
});
