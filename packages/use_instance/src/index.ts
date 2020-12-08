import { useEffect, useRef } from 'react';

type InstanceFn<T> = () => T;
export type Instance<T> = InstanceFn<T> | T;

function useInstance<T>(instance: Instance<T>): T {
  const ref = useRef<T>();

  const get = (): T => {
    if (!ref.current) {
      ref.current = instance instanceof Function ? instance() : instance;
    }
    return ref.current;
  };

  useEffect(() => {
    // clean up effect for fast refresh
    // @ts-ignore
    ref.current = null;
  }, []);

  return get();
}

export default useInstance;
