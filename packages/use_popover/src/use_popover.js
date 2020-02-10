import { useMemo, useEffect, useState, useCallback } from 'react';
import { useWatchTower } from '@jwdinker/watchtower';
import { INITIAL_DIMENSIONS, ELEMENT_TYPES, STYLE_KEYS, SIDES } from './constants';
import getDimensions from './get_dimensions';
import makeOffsets from './make_offsets';
import formatStyles from './format_styles';
import convertTransformToString from './convert_transform_to_string';

function usePopover({
  popover = null,
  element = null,
  triangle = null,
  preference = 'bottom',
} = {}) {
  /*
   * 1. useWatchTower continously updates the positions of the element and it's
   *    scrollable ancestor via a recursive requestAnimationFrame. It contains
   *    coordinates and dimensions values for the:
   * - element
   * - container (the scrollable ancestor)
   * - scroll (This is uncesssary here, but it is part of a unified api for WatchTower/useBeacon)
   */
  const dependencies = useWatchTower(element, { interval: 0 });
  const [dimensions, setDimensions] = useState(() => ({
    triangle: INITIAL_DIMENSIONS,
    popover: INITIAL_DIMENSIONS,
  }));

  const measurements = useMemo(
    () => ({ element: dependencies.element, container: dependencies.container, ...dimensions }),
    [dependencies, dimensions]
  );

  /*
   * makeOffsets returns a function so I don't have to constantly pass the
   * measurements as a parameter.
   */
  const getOffsets = makeOffsets(measurements);

  /*
   * 2. The offsets are calculated based on the preference parameter. getOffsets
   *    returns an object {popover, triangle, total}
   */
  const offsets = getOffsets(preference);

  console.log('OFFSETS: ', measurements);

  /*
   * makeOffsets returns a function so I don't have to constantly pass the
   * measurements as a parameter.
   */
  useEffect(() => {
    if (popover.current) {
      setDimensions({
        popover: getDimensions(popover.current),
        triangle: triangle.current ? getDimensions(triangle.current) : INITIAL_DIMENSIONS,
      });
    }
  }, [popover, triangle]);

  const stylable = useMemo(() => {
    return { popover, triangle };
  }, [popover, triangle]);

  const applyStyles = useCallback(
    (styles) => {
      ELEMENT_TYPES.forEach((type) => {
        const item = stylable[type];
        if (item.current) {
          const values = styles[type];
          STYLE_KEYS.forEach((key) => {
            item.current.style[key] = values[key];
          });
          item.current.style.transform = convertTransformToString(values.transform);
        }
      });
    },
    [stylable]
  );

  const props = useMemo(
    () => ({
      ...measurements,
      getOffsets,
      alignment: preference,
      ...offsets,
      styles: formatStyles(offsets),
      formatStyles,
      applyStyles,
    }),
    [applyStyles, getOffsets, measurements, offsets, preference]
  );

  return props;
}

export default usePopover;
