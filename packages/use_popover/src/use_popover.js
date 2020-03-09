import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import usePortal from '@jwdinker/use-portal';
import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';
import useDimensions from '@jwdinker/use-dimensions';

import { ELEMENT_TYPES, STYLE_KEYS } from './constants';
import { useViewportBoundaries } from './internal';

import { getOffsets, convertTransformToString, formatStyles } from './helpers';

function usePopover(_element, { preference = 'bottom' } = {}) {
  const [alignment, align] = useState(preference);

  const _popover = useRef();
  const _triangle = useRef();
  const [Portal, { open, isOpen, reference }] = usePortal();

  const viewport = useViewportBoundaries();
  const [element] = useBoundingClientRect(_element, { addPageOffsets: true });

  const [popoverDimensions] = useDimensions(_popover);
  const [triangleDimensions] = useDimensions(_triangle);

  const setDependents = useCallback(() => {
    const count = reference.childElementCount;
    const isBoth = count > 1;
    _popover.current = reference.children[isBoth ? 1 : 0];
    _triangle.current = isBoth ? reference.children[0] : null;
  }, [reference]);

  useEffect(() => {
    const isElement = _element && _element.current;
    if (isElement) {
      open();
    }
  }, [_element, element, open]);

  useEffect(() => {
    if (isOpen) {
      setDependents();
    }
  }, [isOpen, reference, setDependents]);

  const styleable = useMemo(() => {
    return { popover: _popover, triangle: _triangle };
  }, []);

  const applyStylesToElement = useCallback(
    (styles) => {
      ELEMENT_TYPES.forEach((type) => {
        const item = styleable[type];
        if (item && item.current) {
          const values = styles[type];
          STYLE_KEYS.forEach((key) => {
            item.current.style[key] = values[key];
          });
          item.current.style.transform = convertTransformToString(values.transform);
        }
      });
    },
    [styleable]
  );

  const offsets = getOffsets(alignment, {
    popover: popoverDimensions,
    element,
    triangle: triangleDimensions,
  });

  const value = useMemo(
    () => ({
      preference,
      viewport,
      alignment,
      offsets,
      align,
      applyStylesToElement,
      styles: formatStyles(offsets),
    }),
    [alignment, applyStylesToElement, offsets, preference, viewport]
  );

  return [Portal, value];
}

export default usePopover;
