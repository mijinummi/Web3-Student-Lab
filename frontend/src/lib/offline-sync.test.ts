import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushQueuedRequests, getQueuedRequests, queueOfflineRequest, removeQueuedRequest } from './offline-sync';

describe('offline-sync', () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    localStorage.clear();

    const queued = await getQueuedRequests();
    for (const item of queued) {
      await removeQueuedRequest(item.id);
    }
  });

  it('queues requests when offline and flushes when online', async () => {
    const request = {
      url: '/test-sync',
      method: 'POST' as const,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'hello' }),
    };

    await queueOfflineRequest(request);
    let queuedRequests = await getQueuedRequests();
    expect(queuedRequests.length).toBe(1);
    expect(queuedRequests[0].url).toBe('/test-sync');

    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await flushQueuedRequests();
    expect(fetchMock).toHaveBeenCalledWith('/test-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: request.body,
      credentials: 'same-origin',
    });

    queuedRequests = await getQueuedRequests();
    expect(queuedRequests.length).toBe(0);
  });
});
