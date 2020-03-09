import { useState, useEffect } from 'react';
import { ELEMENT_TYPES } from './constants';
import { useCustomBoundaries, useOverflowing } from './internal';

function useHideable(props, { boundary = null, hideUntilSeen = true } = {}) {
  const { styles, offsets, viewport } = props;

  const [seen, setSeen] = useState(() => {
    return false;
  });

  const boundaries = useCustomBoundaries(boundary, viewport);

  const overflowing = useOverflowing(offsets.total, boundaries);

  useEffect(() => {
    if (!seen) {
      if (!overflowing.isOverflowing) {
        setSeen(true);
      }
    }
  }, [boundaries, overflowing.isOverflowing, seen]);

  if (!seen && overflowing.isOverflowing && hideUntilSeen) {
    ELEMENT_TYPES.forEach((type) => {
      styles[type].visibility = 'hidden';
    });
  }

  return {
    seen,
    isVisible: !overflowing.isOverflowing,
  };
}

export default useHideable;
