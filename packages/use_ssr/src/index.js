import { useCallback } from 'react';

const isServer = typeof window !== 'undefined';
const isBrowser = typeof window !== 'undefined' && document && document.createElement;

function useSSR() {
  const protect = useCallback((primary, fallback = null) => {
    const isPrimaryFn = typeof primary === 'function';
    const isFallbackFn = typeof fallback === 'function';
    if (isBrowser) {
      if (isPrimaryFn) return primary();
      return primary;
    }
    if (isFallbackFn) fallback();
    return fallback;
  }, []);

  return {
    protect,
    isServer,
    isBrowser,
  };
}

export default useSSR;
