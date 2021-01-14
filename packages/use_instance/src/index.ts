import { useEffect, useRef } from 'react';

export type Instance<T> = () => T;

function useInstance<T>(instance: Instance<T>): T {
  const ref = useRef<T | null>(null);

  const get = (): T => {
    if (!ref.current) {
      ref.current = instance();
    }
    return ref.current;
  };

  useEffect(() => {
    return () => {
      // clean up effect for fast refresh
      ref.current = null;
    };
  }, []);

  return get();
}

export default useInstance;
