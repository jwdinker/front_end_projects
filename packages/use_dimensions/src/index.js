import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';

const INITIAL_STATE = {
  height: 0,
  width: 0,
};

const DIMENSION_PROPERTIES = ['height', 'width'];

const getDimensions = (element) => {
  return {
    height: element.offsetHeight,
    width: element.offsetWidth,
  };
};

const hasChanged = (previous, current) =>
  DIMENSION_PROPERTIES.some((property) => previous[property] !== current[property]);

function useDimensions(_element, { toggable = false } = {}) {
  const measured = useRef();
  const [dimensions, setDimensions] = useState(() => INITIAL_STATE);

  const handler = useCallback(() => {
    const element = _element && _element.current;
    if (element) {
      const nextDimensions = getDimensions(element);

      if (hasChanged(dimensions, nextDimensions)) {
        setDimensions(nextDimensions);
      }
      measured.current = true;
    }
  }, [_element, dimensions]);

  useEffect(() => {
    const element = _element && _element.current;
    if (element && !measured.current) {
      setDimensions(getDimensions(element));
      measured.current = true;
    }
  }, [_element]);

  const [watch, ignore] = useAnimationFrame(
    useMemo(
      () => ({
        onFrame: handler,
        toggable,
      }),
      [handler, toggable]
    )
  );

  return [dimensions, watch, ignore];
}

export default useDimensions;
