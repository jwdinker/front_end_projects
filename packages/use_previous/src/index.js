import { useRef, useEffect } from 'react';

function usePrevious(value, initialValue) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current ? ref.current : initialValue || ref.current;
}

export default usePrevious;
