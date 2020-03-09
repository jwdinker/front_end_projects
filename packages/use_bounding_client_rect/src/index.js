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

function useBoundingClientRect(_element, { toggable = false, addPageOffsets = false } = {}) {
  const [measurements, setMeasurements] = useState(() => INITIAL_STATE);

  const handler = useCallback(() => {
    const element = _element && _element.current;
    if (element) {
      const { top, bottom, left, right, height, width, x, y } = element.getBoundingClientRect();
      const rect = {
        top,
        bottom,
        left,
        right,
        height,
        width,
        x,
        y,
      };

      if (addPageOffsets) {
        const scrollLeft = window.pageXOffset;
        const scrollTop = window.pageYOffset;
        rect.top += scrollTop;
        rect.bottom += scrollTop;
        rect.left += scrollLeft;
        rect.right += scrollLeft;
      }

      if (hasChanged(measurements, rect)) {
        setMeasurements(rect);
      }
    }
  }, [_element, addPageOffsets, measurements]);

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
