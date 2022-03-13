const setCacheTtl = (key: string, ttlMs: number) => {
  window.localStorage.setItem(`${key}-ttl`, JSON.stringify(Date.now() + ttlMs));
};

const isCacheExpired = (key: string): boolean => {
  const ttl = window.localStorage.getItem(`${key}-ttl`);
  if (!ttl) return true;

  return JSON.parse(ttl) < Date.now();
};

export const setToLocalStorage = (
  key: string,
  data: unknown,
  ttlMs: number
) => {
  window.localStorage.setItem(key, JSON.stringify(data));
  setCacheTtl(key, ttlMs);
  console.debug("Cached data for %d ms", ttlMs, data);
};

export const getFromLocalStorage = <T>(key: string): T | undefined => {
  if (isCacheExpired(key)) {
    console.debug("Cache expired for %s", key);

    return undefined;
  }

  const cache = window.localStorage.getItem(key);
  if (cache !== null) {
    const cachedData = JSON.parse(cache);
    console.debug("Loaded data from cache", key, cachedData);

    return cachedData as T;
  }

  /* c8 ignore next */
  return undefined;
};
