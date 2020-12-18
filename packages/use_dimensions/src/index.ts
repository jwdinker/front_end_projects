import * as React from 'react';

const { useCallback, useState, useEffect } = React;
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

type Remeasure = () => void;

type UseDimensionsReturn = [Dimensions, Remeasure];

const hasChanged = (previous: Dimensions, current: Dimensions): boolean =>
  DIMENSION_PROPERTIES.some((property) => previous[property] !== current[property]);

function useDimensions(
  element: React.RefObject<HTMLElement | undefined> | null
): UseDimensionsReturn {
  const [dimensions, setDimensions] = useState<Dimensions>(() => INITIAL_STATE);

  const resize = useCallback(() => {
    if (element && element.current) {
      const nextDimensions = getDimensions(element.current);

      if (hasChanged(dimensions, nextDimensions)) {
        setDimensions(nextDimensions);
      }
    }
  }, [dimensions, element]);

  useEffect(() => {
    resize();
  }, [resize]);

  return [dimensions, resize];
}

export default useDimensions;
