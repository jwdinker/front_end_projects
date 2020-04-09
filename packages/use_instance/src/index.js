import { useRef, useCallback } from 'react';

function useInstance(instance = null) {
  const ref = useRef(null);

  const get = useCallback(() => {
    if (ref.current === null) {
      const isFunction = typeof instance === 'function';
      ref.current = isFunction ? instance() : instance;
    }
    return ref.current;
  }, [instance]);

  return get();
}

export default useInstance;
