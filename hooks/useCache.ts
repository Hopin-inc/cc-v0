type CacheEntry<T> = {
  data: T;
  promise: Promise<T> | null;
  timestamp: number;
};

const cache: Record<string, CacheEntry<any>> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5分

export function useCache<T>(key: string) {
  const getCachedData = async (
    fetchFn: () => Promise<T>,
    forceFetch = false
  ): Promise<T> => {
    const now = Date.now();
    const entry = cache[key];

    // キャッシュが有効な場合はキャッシュを返す
    if (
      !forceFetch &&
      entry &&
      entry.data &&
      now - entry.timestamp < CACHE_DURATION
    ) {
      return entry.data;
    }

    // 進行中のリクエストがある場合はそれを返す
    if (entry?.promise) {
      return entry.promise;
    }

    // 新しいリクエストを開始
    const promise = fetchFn().then((data) => {
      cache[key] = {
        data,
        promise: null,
        timestamp: Date.now(),
      };
      return data;
    });

    cache[key] = {
      data: entry?.data || null,
      promise,
      timestamp: entry?.timestamp || 0,
    };

    return promise;
  };

  const invalidateCache = () => {
    delete cache[key];
  };

  return {
    getCachedData,
    invalidateCache,
  };
}
