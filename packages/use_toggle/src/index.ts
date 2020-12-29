import { useState, useCallback } from 'react';

/** TOGGLE COMMENT */

interface ToggleHelpers {
  toggle: () => void;
  activate: () => void;
  deactivate: () => void;
}

type ToggleReturn = [boolean, ToggleHelpers];

/**
 *useToggle
 *----------
 * Handles active and inactive states and provides helpers for managing those
 * states.
 *
 * @param initialValue The initial value of the whether the toggler is active or
 * inactive
 *
 */
function useToggle(initialValue = false): ToggleReturn {
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

  const helpers = {
    activate,
    deactivate,
    toggle,
  };

  return [active, helpers];
}

export default useToggle;
