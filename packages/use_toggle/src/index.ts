import { useState, useCallback, useMemo } from 'react';

interface ToggleHelpers {
  toggle: () => void;
  activate: () => void;
  deactivate: () => void;
}

type ToggleReturnValue = [boolean, ToggleHelpers];

/**
 *useToggle
 *----------
 * Handles active and inactive states and provides helpers for managing those
 * states.
 *
 * @param initialBool The initial value of the whether the toggler is active or
 * inactive
 *
 */
function useToggle(initialValue = false): ToggleReturnValue {
  const [active, setActive] = useState(() => initialValue);

  const activate = useCallback(() => {
    return setActive(true);
  }, []);

  const deactivate = useCallback(() => {
    return setActive(false);
  }, []);

  const toggle = useCallback((): void => {
    setActive((previous) => {
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
