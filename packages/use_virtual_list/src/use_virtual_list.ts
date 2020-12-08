import * as React from 'react';
import useMeasurementsIndexer, { IndexRange, OnMeasure } from '@jwdinker/use-measurements-indexer';
import { useScroll } from '@jwdinker/use-scroll';
import upTo from '@jwdinker/up-to';
import usePrevious from '@jwdinker/use-previous';
import { ScrollToIndexOptions, VirtualListProps } from './types';

import {
  SCROLLER_BASE_STYLE,
  SPACER_BASE_STYLE,
  CONFIGURATIONS,
  SCROLL_TO_ALIGNMENTS,
} from './constants';
import { getScrollOffsetForAlignment, convertPctToPx } from './helpers';

const { useRef, useEffect, useMemo, createElement } = React;

function useVirtualList(props: VirtualListProps) {
  const {
    component,
    responsive = false,
    axis = 'y',
    containerSize = 0,
    itemSize,
    numberOfItems,
    onMeasure = () => {},
    estimatedItemSize,
    buffer = 3,
  } = props;

  const scroller = useRef<HTMLElement | HTMLDivElement>();

  const typeOf = CONFIGURATIONS[axis];
  const unit = responsive ? '%' : 'px';

  const [scroll, scrollTo] = useScroll(scroller);

  const previousDirection = usePrevious(scroll.direction);
  const lastContainerSize = usePrevious(containerSize);

  /*
    When the scroll ends, the direction is set to zero so the previous direction
    of the scroll must be used.  The direction of the buffered elements has to
    match the direction of the scroll.  The prevents added repaints from adding
    and removing elements on every scroll end.
  */
  const scrollDirection = scroll.isScrolling ? scroll.direction : previousDirection;

  /*
    When responsive, the scroll offset of the axis is converted to a percentage
    of the container in order to match with the percentage of the size and
    offset of the items.
  */
  const scrollOffset = responsive
    ? (scroll[typeOf.scroll] / containerSize) * 100
    : scroll[typeOf.scroll];

  const cache = useRef({});

  const saveProps: OnMeasure = (index, itemMeasurements) => {
    const { size, offset } = itemMeasurements;
    onMeasure(index, itemMeasurements);

    cache.current[index] = {
      key: index,
      index,
      style: {
        position: 'absolute',
        [typeOf.dimension]: `${size}${unit}`,
        [typeOf.oppositeDimension]: '100%',
        [typeOf.offset]: `${offset}${unit}`,
      },
    };
  };

  const onClear = () => {
    cache.current = {};
  };

  /*
    When resetFromIndex is called, the styles cached for those particular
    indexes need to be removed.  
  */
  const onReset = (resetRange: IndexRange) => {
    const [startIndex, endIndex] = resetRange;
    for (let index = startIndex; index <= endIndex; index += 1) {
      delete cache.current[index];
    }
  };

  const measurementsIndexer = useMeasurementsIndexer({
    numberOfItems,
    itemSize,
    onMeasure: saveProps,
    estimatedItemSize,
    log: false,
    onClear,
    onReset,
  });

  const {
    getMeasurements,
    getEndIndex,
    getOffsetAtIndex,
    getTotalSize,
    resetFromIndex,
    clear,
  } = measurementsIndexer;

  /*
    Since the container is only measured after it is rendered, the container
    size would default to zero on the first render.  
  */
  const canRender = containerSize > 0;

  const hasContainerSizeChanged = lastContainerSize !== containerSize;

  const bufferOffset = responsive ? 100 : containerSize;

  // buffer size is applied to the direction of the scroll
  const [startBuffer, endBuffer] = scrollDirection === -1 ? [-buffer, 0] : [0, buffer];

  const visibleStartIndex = canRender ? getOffsetAtIndex(scrollOffset) : 0;
  const visibleEndIndex = canRender
    ? getEndIndex(visibleStartIndex, scrollOffset + bufferOffset)
    : 0;

  const renderStart = Math.max(0, visibleStartIndex + startBuffer);
  const renderEnd = visibleEndIndex + endBuffer;

  /*
    The items are memoized to prevent unnecessary recreation of the elements.
  */
  const items = useMemo((): React.Component[] => {
    if (!canRender) {
      return [];
    }
    return upTo<React.Component>(renderStart, renderEnd, (index: number) => {
      let elementProps = cache.current[index];

      if (!elementProps) {
        /*
          when the render buffer is greater than 0, the extra rendered items may
          not have been measured yet so they need to be accounted for.
        */

        getMeasurements(index);
        elementProps = cache.current[index];
      }

      return createElement(component, cache.current[index]);
    });
  }, [canRender, component, getMeasurements, renderEnd, renderStart]);

  const totalSize = canRender ? getTotalSize() : 0;

  /**
   * scrollToIndex
   * -------------------------------------------------------------------------
   * @param index The index to scroll to.  If the index is less than zero, the
   * element will scroll to position 0.  If the index is greater than the number
   * of items, the element will scroll to the last item.
   * @param options The options that control the behavior of the scroll.
   * @param options.alignment The final position relative to the scrolling element.
   * @param options.easing The type of easing function used to animate the
   * scroll.
   * @param options.duration The duration of the scroll animation.
   */
  const scrollToIndex = (index: number, options: ScrollToIndexOptions = {}) => {
    const { alignment = SCROLL_TO_ALIGNMENTS.START, ...scrollToOptions } = options;
    if (scroller.current) {
      const item = getMeasurements(index);

      const nextTotalSize = getTotalSize();

      const values = [nextTotalSize, item.offset, item.size];

      /*
        If the virtual list is using a reponsive percentage, the total size of
        the items,item offset, and item size must be converted to a percentage
        since scrollTo values only work with pixels.   
      */
      const convertedValues = responsive
        ? values.map((value) => convertPctToPx(value, containerSize))
        : values;

      const [totalSizeConverted, offsetConverted, sizeConverted] = convertedValues;

      // The alignment is calculated.
      const coordinate = getScrollOffsetForAlignment({
        alignment,
        containerSize,
        totalSizeOfItems: totalSizeConverted,
        offsetOfItem: offsetConverted,
        sizeOfItem: sizeConverted,
      });

      scrollTo({
        [typeOf.scroll]: coordinate,
        ...scrollToOptions,
      });
    }
  };

  const scrollerProps = useMemo(
    () => ({
      ref: scroller,
      style: {
        ...SCROLLER_BASE_STYLE,
        [typeOf.dimension]: `${containerSize}px`,
        [typeOf.max]: `${containerSize}px`,
        [typeOf.oppositeDimension]: '100%',
      },
    }),
    [containerSize, typeOf.dimension, typeOf.max, typeOf.oppositeDimension]
  );

  const spacerProps = useMemo(
    () => ({
      style: {
        ...SPACER_BASE_STYLE,
        [typeOf.min]: `${totalSize}${unit}`,
        [typeOf.oppositeDimension]: `100%`,
      },
    }),
    [totalSize, typeOf.min, typeOf.oppositeDimension, unit]
  );

  /*
    When a resize occurs and a pixel unit is used, the sizes will need to be
    cleared.  
  */
  const canClearCache = !responsive && canRender && hasContainerSizeChanged;

  useEffect(() => {
    if (canClearCache) {
      clear();
    }
  }, [canClearCache, clear]);

  const indexes = {
    visible: [visibleStartIndex, visibleEndIndex],
    rendered: [renderStart, renderEnd],
  };

  return [
    items,
    {
      indexes,
      scroller: scrollerProps,
      spacer: spacerProps,
      scroll,
      scrollToIndex,
      resetFromIndex,
    },
  ];
}

export default useVirtualList;
