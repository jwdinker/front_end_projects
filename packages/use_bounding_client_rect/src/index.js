import { useState, useMemo, useCallback } from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';

const INITIAL_STATE = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: 0,
  width: 0,
};

const MEASURABLE_PROPERTIES = ['top', 'left', 'height', 'width'];

const hasChanged = (previous, current) =>
  MEASURABLE_PROPERTIES.some((property) => previous[property] !== current[property]);

function useBoundingClientRect(element, { toggable = false } = {}) {
  const [measurements, setMeasurements] = useState(() => INITIAL_STATE);

  const handler = useCallback(() => {
    const isElement = element && element.current;
    if (isElement) {
      const nextMeasurements = element.current.getBoundingClientRect();

      if (hasChanged(measurements, nextMeasurements)) {
        setMeasurements(nextMeasurements);
      }
    }
  }, [element, measurements]);

  const [watch, unwatch] = useAnimationFrame(
    useMemo(
      () => ({
        onFrame: handler,
        toggable,
      }),
      [handler, toggable]
    )
  );

  return [measurements, watch, unwatch];
}

export default useBoundingClientRect;
