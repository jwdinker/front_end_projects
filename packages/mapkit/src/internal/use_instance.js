import { useRef } from 'react';

function useInstance(instance = null) {
  const ref = useRef(null);

  function get() {
    if (ref.current === null) {
      const isFunction = typeof instance === 'function';
      ref.current = isFunction ? instance() : instance;
    }
    return ref.current;
  }

  return get();
}

export default useInstance;
