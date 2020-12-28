import * as React from 'react';
import useMeasurementsIndexer, { IndexRange, OnMeasure } from '@jwdinker/use-measurements-indexer';

import upTo from '@jwdinker/up-to';
import usePrevious from '@jwdinker/use-previous';
import { UnitType, VirtualListProps } from './types';

import {
  CONTAINER_BASE_STYLE,
  SPACER_BASE_STYLE,
  CONFIGURATIONS,
  SCROLL_TO_ALIGNMENTS,
  DEFAULT_INDEXES,
} from './constants';
import { getScrollOffsetForAlignment, pctToPx, pxToPct } from './helpers';

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
    bufferByDirection = true,
  } = props;

  const typeOf = CONFIGURATIONS[axis];
  const unit = responsive ? '%' : 'px';

  const previousDirection = usePrevious(direction);
  const lastContainerSize = usePrevious(containerSize);
  const previousAxis = usePrevious(axis);

  const isInfinite = numberOfItems === -1;

  /*
    When a scroll or swipe ends, the direction maybe set to zero so the previous
    direction must be used.  The direction of the buffered elements has to match
    the direction of the scroll.  The prevents added repaints from adding and
    removing elements on every scroll end.
  */
  const staticDirection = direction === 0 ? direction : previousDirection;

  /*
    When responsive, the scroll offset of the axis is converted to a percentage
    of the container in order to match with the percentage of the size and
    offset of the items.
  */
  const formattedOffset = responsive ? pxToPct(offset, containerSize) : offset;
  const keystoneOffset = isInfinite ? formattedOffset : Math.max(0, formattedOffset);

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

  const lastIndex = isInfinite ? 0 : numberOfItems - 1;

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
    infinite: isInfinite,
  });

  const {
    clear,
    getIndexByOffset,
    getMeasurements,
    getIndexRangeFromOffsets,
    getTotalSizeOfItems,
    resetFromIndex,
  } = measurementsIndexer;

  /*
    Since the container is only measured after it is rendered, the container
    size would default to zero on the first render.  
  */
  const canRender = containerSize > 0;

  const hasContainerSizeChanged = lastContainerSize !== containerSize;
  const hasAxisChanged = previousAxis !== axis;

  const leadingOffset = responsive ? 100 : containerSize;

  /* 
    If bufferByDirection is enabled, buffer size is applied to the direction of
    the movement. Because there could be a number of items that has a total size
    smaller than the containerSize, the backwards buffer is only applied
    backwards when the keystoneOffset is less than the container, otherwise the
    buffer size would make items disappear. 
  */
  let startBuffer = -bufferSize;
  let endBuffer = bufferSize;

  const isOffsetBiggerThanView = keystoneOffset > leadingOffset;
  const isBackwards = staticDirection === -1;
  const isForwards = staticDirection === 1;

  if (bufferByDirection) {
    if (isOffsetBiggerThanView) {
      if (isForwards) {
        startBuffer = 0;
      }
      if (isBackwards) {
        endBuffer = 0;
      }
    }
  }

  const visibleIndexes = canRender
    ? getIndexRangeFromOffsets(keystoneOffset, keystoneOffset + leadingOffset)
    : DEFAULT_INDEXES;

  let renderStart = 0;
  let renderEnd = 0;

  if (canRender) {
    if (isInfinite) {
      renderStart = visibleIndexes[0] + startBuffer;
      renderEnd = visibleIndexes[1] + endBuffer;
    } else {
      renderStart = Math.max(0, visibleIndexes[0] + startBuffer);
      renderEnd = Math.min(visibleIndexes[1] + endBuffer, numberOfItems - 1);
    }
  }

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
        If the virtual list is using a responsive percentage, the total size of
        the items,item offset, and item size must be converted to a percentage
        since scrollTo values only work with pixels.   
      */
    const convertedValues = responsive
      ? values.map((value) => pctToPx(value, containerSize))
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

  const getMeasurementsAtIndex = (index: number, unitType: UnitType = unit) => {
    const item = getMeasurements(index);
    if (unitType === 'px' && unit === '%') {
      return {
        offset: pctToPx(item.offset, containerSize),
        size: pctToPx(item.size, containerSize),
      };
    }
    if (unitType === '%' && unit === 'px') {
      return {
        offset: pxToPct(item.offset, containerSize),
        size: pxToPct(item.size, containerSize),
      };
    }
    return item;
  };

  useEffect(() => {
    if (canClearCache) {
      clear();
    }
  }, [canClearCache, clear]);

  const indexes = {
    visible: visibleIndexes,
    rendered: [renderStart, renderEnd],
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
    getMeasurementsAtIndex,
    getIndexByOffset,
    getAlignedOffsetForIndex,
  };
}

export default useVirtualList;
