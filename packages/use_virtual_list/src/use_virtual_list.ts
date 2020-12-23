import * as React from 'react';
import useMeasurementsIndexer, { IndexRange, OnMeasure } from '@jwdinker/use-measurements-indexer';

import upTo from '@jwdinker/up-to';
import usePrevious from '@jwdinker/use-previous';
import { VirtualListProps } from './types';

import {
  CONTAINER_BASE_STYLE,
  SPACER_BASE_STYLE,
  CONFIGURATIONS,
  SCROLL_TO_ALIGNMENTS,
  DEFAULT_INDEXES,
} from './constants';
import { getScrollOffsetForAlignment, convertPctToPx } from './helpers';

const { useRef, useEffect, useMemo, createElement } = React;

function useVirtualList(props: VirtualListProps) {
  const {
    component,
    axis = 'y',
    responsive = true,
    containerSize = 0,
    direction = 0,
    offset = 0,
    itemSize,
    numberOfItems,
    onMeasure = () => {},
    estimatedItemSize,
    bufferSize = 3,
  } = props;

  const typeOf = CONFIGURATIONS[axis];
  const unit = responsive ? '%' : 'px';

  const previousDirection = usePrevious(direction);
  const lastContainerSize = usePrevious(containerSize);
  const previousAxis = usePrevious(axis);

  /*
    When the scroll ends, the direction is set to zero so the previous direction
    of the scroll must be used.  The direction of the buffered elements has to
    match the direction of the scroll.  The prevents added repaints from adding
    and removing elements on every scroll end.
  */
  const staticDirection = direction === 0 ? direction : previousDirection;

  /*
    When responsive, the scroll offset of the axis is converted to a percentage
    of the container in order to match with the percentage of the size and
    offset of the items.
  */
  const keystoneOffset = responsive ? Math.round((offset / containerSize) * 100) : offset;

  const cache = useRef({});

  const saveProps: OnMeasure = (index, item) => {
    onMeasure(index, item);

    cache.current[index] = {
      key: index,
      index,
      style: {
        position: 'absolute',
        [typeOf.dimension]: `${item.size}${unit}`,
        [typeOf.oppositeDimension]: '100%',
        [typeOf.offset]: `${item.offset}${unit}`,
      },
    };
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
    // !hacky way to get item's useMemo to run again since _cache is dependency.
    cache.current = { ...cache.current };
  };

  const lastIndex = numberOfItems - 1;

  const onClear = () => {
    cache.current = {};
  };

  const measurementsIndexer = useMeasurementsIndexer({
    boundaries: [0, lastIndex],
    itemSize,
    onMeasure: saveProps,
    estimatedItemSize,
    onReset,
    onClear,
  });

  const {
    clear,
    getMeasurements,
    findIndexAtOffset,
    getIndexRangeFromOffsets,
    getTotalSizeOfItems,
    resetFromIndex,
  } = measurementsIndexer;

  /*
    Since the container is only measured after it is rendered, the container
    size would default to zero on the first render.  
  */
  const canRender = containerSize > 0 && numberOfItems > 0;

  const hasContainerSizeChanged = lastContainerSize !== containerSize;
  const hasAxisChanged = previousAxis !== axis;

  const leadingOffset = responsive ? 100 : containerSize;

  /* 
    Buffer size is applied to the direction of the movement. Because there could
    be a number of items that has a total size smaller than the containerSize, the
    backwards buffer is only applied backwards when the keystoneOffset is less
    than the container, otherwise the buffer size would make items disappear. 
  */
  const [startBuffer, endBuffer] =
    staticDirection === -1 && keystoneOffset > leadingOffset ? [-bufferSize, 0] : [0, bufferSize];

  const visibleIndexes = canRender
    ? getIndexRangeFromOffsets(keystoneOffset, keystoneOffset + leadingOffset)
    : DEFAULT_INDEXES;

  const renderedIndexes = canRender
    ? [
        Math.max(0, visibleIndexes[0] + startBuffer),
        Math.min(visibleIndexes[1] + endBuffer, numberOfItems - 1),
      ]
    : DEFAULT_INDEXES;

  const [renderStart, renderEnd] = renderedIndexes;
  /*
    The items are memoized to prevent unnecessary recreation of the elements.
    The cache ref is assigned to  a local variable so that when the component
    remounts the memo function knows to rerun.
  */
  const _cache = cache.current;

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
        elementProps = _cache[index];
      }

      return createElement(component, _cache[index]);
    });
    /* 
      ! since I only need the render indexes to trigger the useMemo hook,
      ! getMeasurements can be omitted.  Sometimes i hate the dependency array.
    */

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRender, component, renderEnd, renderStart, _cache]);

  const totalSize = canRender ? getTotalSizeOfItems() : 0;

  const getAlignedOffsetForIndex = (index: number, alignment = SCROLL_TO_ALIGNMENTS.START) => {
    const item = getMeasurements(index);

    const nextTotalSize = getTotalSizeOfItems();

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

    // The offset for the alignment is calculated.
    const coordinate = getScrollOffsetForAlignment({
      alignment,
      containerSize,
      totalSizeOfItems: totalSizeConverted,
      offsetOfItem: offsetConverted,
      sizeOfItem: sizeConverted,
    });

    return {
      [axis]: coordinate,
      [typeOf.oppositeAxis]: 0,
    };
  };

  const containerStyle = useMemo(
    () => ({
      ...CONTAINER_BASE_STYLE,
      [typeOf.dimension]: `${containerSize}px`,
      [typeOf.max]: `${containerSize}px`,
      [typeOf.oppositeDimension]: '100%',
    }),
    [containerSize, typeOf.dimension, typeOf.max, typeOf.oppositeDimension]
  );

  const spacerStyle = useMemo(
    () => ({
      ...SPACER_BASE_STYLE,
      [typeOf.min]: `${totalSize}${unit}`,
      [typeOf.oppositeDimension]: `100%`,
    }),
    [totalSize, typeOf.min, typeOf.oppositeDimension, unit]
  );

  /*
    When a resize occurs and a pixel unit is used, the sizes will need to be
    cleared.  
  */
  const canClearCache = hasAxisChanged || (!responsive && canRender && hasContainerSizeChanged);

  useEffect(() => {
    if (canClearCache) {
      clear();
    }
  }, [canClearCache, clear]);

  const indexes = {
    visible: visibleIndexes,
    rendered: renderedIndexes,
  };

  useEffect(() => {
    return () => {
      cache.current = {};
    };
  }, []);

  const styles = {
    spacer: spacerStyle,
    container: containerStyle,
  };

  return {
    items,
    styles,
    indexes,
    convertedOffset: keystoneOffset,
    resetFromIndex,
    getMeasurementsAtIndex: getMeasurements,
    findIndexAtOffset,
    getAlignedOffsetForIndex,
  };
}

export default useVirtualList;
