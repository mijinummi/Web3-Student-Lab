import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

const DB_NAME = 'web3-student-lab-offline-sync';
const DB_VERSION = 1;
const STORE_NAME = 'queued-requests';

interface OfflineSyncSchema extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: QueuedRequest;
  };
}

export type QueuedRequestMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface QueuedRequest {
  id: string;
  url: string;
  method: QueuedRequestMethod;
  headers: Record<string, string>;
  body?: string;
  createdAt: number;
}

let dbPromise: Promise<IDBPDatabase<OfflineSyncSchema>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<OfflineSyncSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function queueOfflineRequest(request: Omit<QueuedRequest, 'id' | 'createdAt'>) {
  if (typeof window === 'undefined') {
    return;
  }

  const db = await getDb();
  const queuedRequest: QueuedRequest = {
    ...request,
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: Date.now(),
  };

  await db.put(STORE_NAME, queuedRequest);
}

export async function getQueuedRequests(): Promise<QueuedRequest[]> {
  if (typeof window === 'undefined') {
    return [];
  }

  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function removeQueuedRequest(id: string) {
  if (typeof window === 'undefined') {
    return;
  }

  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

export async function flushQueuedRequests() {
  if (typeof window === 'undefined' || !navigator.onLine) {
    return;
  }

  const requests = await getQueuedRequests();
  for (const request of requests) {
    try {
      const fetchOptions = {
        method: request.method,
        headers: request.headers,
        body: request.body,
        credentials: 'same-origin' as RequestCredentials,
      };
      const response = await fetch(request.url, fetchOptions);
      if (response.ok) {
        await removeQueuedRequest(request.id);
      }
    } catch (error) {
      console.warn('[OfflineSync] Flush failed, keeping queued request:', request.id, error);
      // Leave failed requests in the queue for the next online event.
    }
  }
}

export function registerOnlineSync() {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleOnline = () => {
    flushQueuedRequests().catch((error) => {
      console.error('[OfflineSync] Error flushing queued requests:', error);
    });
  };

  window.addEventListener('online', handleOnline);

  return () => {
    window.removeEventListener('online', handleOnline);
  };
}
