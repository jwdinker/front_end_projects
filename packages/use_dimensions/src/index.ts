import { useState, useCallback } from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';

const INITIAL_STATE = {
  height: 0,
  width: 0,
};

const DIMENSION_PROPERTIES = ['height', 'width'];

export interface Dimensions {
  height: number;
  width: number;
}

const getDimensions = (element: HTMLElement): Dimensions => {
  return {
    height: element.offsetHeight,
    width: element.offsetWidth,
  };
};

type UseDimensionsReturnValue = [Dimensions, () => void, () => void];

const hasChanged = (previous: Dimensions, current: Dimensions): boolean =>
  DIMENSION_PROPERTIES.some((property) => previous[property] !== current[property]);

function useDimensions(
  element: React.RefObject<HTMLElement | undefined> | null
): UseDimensionsReturnValue {
  const [dimensions, setDimensions] = useState<Dimensions>(() => INITIAL_STATE);

  const handler = useCallback(() => {
    if (element && element.current) {
      const nextDimensions = getDimensions(element.current);

      if (hasChanged(dimensions, nextDimensions)) {
        setDimensions(nextDimensions);
      }
    }
  }, [dimensions, element]);

  const [monitor, unmonitor] = useAnimationFrame(handler);

  return [dimensions, monitor, unmonitor];
}

export default useDimensions;
