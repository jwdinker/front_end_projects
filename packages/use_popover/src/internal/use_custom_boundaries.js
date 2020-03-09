import { useEffect, useMemo } from 'react';

import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';

function useCustomBoundaries(_element, fallbackBoundaries) {
  const element = (_element && _element.current) || null;
  const isCustomBoundary = useMemo(() => !!element, [element]);
  const [boundaries, monitor, unmonitor] = useBoundingClientRect(_element, {
    addPageOffsets: true,
    toggable: true,
  });

  /* eslint-disable consistent-return */
  useEffect(() => {
    if (isCustomBoundary) {
      monitor();
      return unmonitor;
    }
  }, [isCustomBoundary, monitor, unmonitor]);
  /* eslint-enable consistent-return */

  return isCustomBoundary ? boundaries : fallbackBoundaries;
}

export default useCustomBoundaries;
