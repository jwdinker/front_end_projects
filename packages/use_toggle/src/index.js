import { useState, useCallback, useMemo } from 'react';

function useToggle(initialBool = false) {
  const [active, setActive] = useState(() => initialBool);

  const activate = useCallback(() => {
    return setActive(true);
  }, []);

  const deactivate = useCallback(() => {
    return setActive(false);
  }, []);

  const toggle = useCallback(() => {
    return setActive((previous) => {
      return !previous;
    });
  }, []);

  const helpers = useMemo(() => {
    return {
      activate,
      deactivate,
      toggle,
    };
  }, [activate, deactivate, toggle]);

  return [active, helpers];
}

export default useToggle;
