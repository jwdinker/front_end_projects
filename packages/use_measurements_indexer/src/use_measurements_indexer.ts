/* eslint-disable react/static-property-placement */

import * as React from 'react';
import { IndexRange, Measurements, MeasurementsIndexerProps } from './types';
import {
  validateOffsetRange,
  getNumberOfItems,
  getInitialState,
  binarySearch,
  isForwards,
  isBackwards,
} from './helpers';

const { useRef, useEffect } = React;

function useMeasurementsIndexer(props: MeasurementsIndexerProps) {
  const {
    itemSize = 0,
    estimatedItemSize = 0,
    boundaries = [0, 0],
    // infinite prop has to be included otherwise it messes up the
    // getNumberOfItems if there is 1 item.
    infinite = false,
    onMeasure = () => {},
    onReset = () => {},
    onClear = () => {},
  } = props;

  const state = useRef(getInitialState());

  const fixedItemSize = typeof itemSize === 'number' ? itemSize : 0;
  const numberOfItems = getNumberOfItems(boundaries);

  /**
   * getSafeIndex
   * -------------------------------------------------------------------------
   * @param index - the index checked against the boundaries.  If the index
   * falls outside the boundaries, an index is returned to the closest boundary.
   * -------------------------------------------------------------------------
   */
  function getSafeIndex(index: number): number {
    const [min, max] = state.current.indexed;

    if (infinite) {
      // max value always starts at -1 so make sure -1 isn't measured first if
      // infinite and offset will always be above >= 0.  Seems hacky, but most
      // elegant thing i can come up with.
      if (min === 0 && max === -1) {
        return 0;
      }
      return index;
    }

    const [lower, upper] = boundaries;
    return Math.max(lower, Math.min(index, upper));
  }

  /**
   * inRange
   * -------------------------------------------------------------------------
   * @param index - the index that will checked whether it's in bounds are not.
   * If the infinite setting is enabled, the index is assumed to be in range.
   * -------------------------------------------------------------------------
   */
  function inRange(index: number) {
    if (infinite) {
      return infinite;
    }
    return infinite || (index >= boundaries[0] && index < boundaries[1]);
  }

  /**
   * getItemSize
   * -------------------------------------------------------------------------
   * @param index - index of the measurement about to be taken.
   * @param offset - offset of the previously measured item.
   * -------------------------------------------------------------------------
   */
  function getItemSize(index: number): number {
    return typeof itemSize === 'function' ? itemSize(index) : fixedItemSize;
  }

  /**
   * setMeasurements
   * -------------------------------------------------------------------------
   * @param index The key of the cached measurements.
   * @param offset The offset of the item.
   * @param size The size of the item.
   * -------------------------------------------------------------------------
   */
  function setMeasurements(index: number, measurements: Measurements) {
    state.current.cache[index] = measurements;
    onMeasure(index, measurements);
  }

  /**
   * getMeasuredSize
   * -------------------------------------------------------------------------
   * @description
   * Returns the sum of all the current measured indexes.
   * -------------------------------------------------------------------------
   */
  function getMeasuredSize(): number {
    const [min, max] = state.current.indexed;
    const lowestMeasured = getMeasurements(min);
    const highestMeasured = getMeasurements(max);

    // offsets can run negative so absolute value used.
    return (
      Math.abs(lowestMeasured.offset) + Math.abs(highestMeasured.offset) + highestMeasured.size
    );
  }

  /**
   * measureToOffset
   * -------------------------------------------------------------------------
   * @param threshold - the offset threshold from which measurements will be
   * taken up to / down to.
   * -------------------------------------------------------------------------
   */
  function measureToOffset(threshold = 0) {
    const { indexed, cache } = state.current;

    // key is indexed min or max depending on direction.
    const key = threshold >= 0 ? 1 : 0;
    let index = indexed[key];

    // get item measurements or no measurements taken yet so use defaults
    const item = cache[index] || { offset: 0, size: 0 };

    // offset computed by direction:
    // - moving forwards: previous item's bottom/right offset.
    // - moving backwards: previous item's top/left offset minus current item size.
    let offset = key === 1 ? item.offset + item.size : item.offset;

    if (inRange(index)) {
      if (isForwards(threshold)) {
        while (offset <= threshold) {
          index += 1;
          const size = getItemSize(index);
          setMeasurements(index, { offset, size });
          offset += size;
        }
      }

      if (isBackwards(threshold)) {
        while (offset > threshold) {
          index -= 1;
          const size = getItemSize(index);
          offset -= size;
          setMeasurements(index, { offset, size });
        }
      }
    }

    // The index is set as the new min or max.
    indexed[key] = index;
    return index;
  }

  /**
   * measureToIndex
   * -------------------------------------------------------------------------
   * @param requestedIndex - The upper or lower limit at which measurements will
   * be cached.
   * -------------------------------------------------------------------------
   */
  function measureToIndex(requestedIndex: number) {
    const index = getSafeIndex(requestedIndex);
    const { indexed, cache } = state.current;

    // key is indexed min or max depending on direction.
    const key = index >= 0 ? 1 : 0;
    const [min, max] = indexed;
    const edge = indexed[key];
    const item = cache[edge] || { offset: 0, size: 0 };

    // max + 1 and min - 1 keep items from being re-cached and onMeasure from
    // being invoked multiple times.
    if (isForwards(index)) {
      let offset = item.offset + item.size;
      for (let i = max + 1; i <= index; i += 1) {
        const size = getItemSize(i);
        setMeasurements(i, { offset, size });
        offset += size;
      }
    }

    if (isBackwards(index)) {
      let { offset } = item;
      for (let i = min - 1; i >= index; i -= 1) {
        const size = getItemSize(i);
        // going backwards, size subtracted from offset
        setMeasurements(i, { offset: offset - size, size });
        offset -= size;
      }
    }

    // The index is set as the new min or max.
    indexed[key] = index;

    return cache[index];
  }

  /**
   * getMeasurements
   * -------------------------------------------------------------------------
   * @param index - The upper or lower limit at which measurements will
   * be cached.
   * -------------------------------------------------------------------------
   */
  function getMeasurements(index: number): Measurements {
    const { cache } = state.current;
    const item = cache[index];
    if (item) {
      return item;
    }
    return measureToIndex(index);
  }

  /**
   * getIndexByOffset
   * -------------------------------------------------------------------------
   * @param offset The offset used to find the closest matching index
   * by iterating through cached offsets.
   * @description
   * - The highest and lowest offsets are retreived in order to see if the
   *   offset argument is within the range that has already been measured.
   * -------------------------------------------------------------------------
   */
  function findIndexAtOffset(offset: number): number {
    const { indexed } = state.current;

    const key = isForwards(offset) ? 1 : 0;
    const measuredFromIndex = indexed[key];
    const lastMeasuredOffset = getMeasurements(measuredFromIndex).offset;
    const hasForwardMeasured = isForwards(offset) && offset <= lastMeasuredOffset;
    const hasBackwardMeasured = isBackwards(offset) && offset > lastMeasuredOffset;
    const inMeasuredRange = hasForwardMeasured || hasBackwardMeasured;

    if (inMeasuredRange) {
      return binarySearch(indexed, offset, getMeasurements);
    }
    return measureToOffset(offset);
  }

  /**
   * findClosingIndex
   * -------------------------------------------------------------------------
   * @param startIndex The index used to retreive the starting offset of the
   * accumlating size.
   * @param threshold The amount to add to the index's offset in order to
   * determine the closing index.
   * -------------------------------------------------------------------------
   */
  function findClosingIndex(startIndex: number, threshold: number): number {
    const { offset, size } = getMeasurements(startIndex);

    // The start index's bottom offset is used as a starting point
    let totalSize = offset + size;
    let endIndex = startIndex;

    // only the threshold will be used if infinite is enabled.
    while (totalSize < threshold && inRange(endIndex)) {
      endIndex += 1;
      const currentSize = getMeasurements(endIndex).size;
      totalSize += currentSize;
    }

    return endIndex;
  }

  /**
   * getIndexRangeFromOffsets
   * -------------------------------------------------------------------------
   * @param startOffset The offset used to find the start of the index segment.
   * @param endOffset The offset used to find the end of the index segment.
   * -------------------------------------------------------------------------
   */
  function getIndexRangeFromOffsets(startOffset: number, endOffset: number): IndexRange {
    validateOffsetRange(startOffset, endOffset);
    /*
     zero must be offered up as an alternative when rubberband scrolling returns
     a negative value and the index doesn't exist. 
    */
    const startIndex = findIndexAtOffset(startOffset) || 0;
    const endIndex = findClosingIndex(startIndex, endOffset);

    return [startIndex, endIndex];
  }

  /**
   * clear
   * -------------------------------------------------------------------------
   * @description
   * - Clears the measurements cache and resets the lowest and highest measured
   *   indexes back to 0.
   * - Primary use case is if the measurements change, the cache needs to be
   *   cleared.
   * -------------------------------------------------------------------------
   */
  function clear(): void {
    state.current = getInitialState();
    onClear();
  }

  /**
   * getTotalSizeOfItems
   * -------------------------------------------------------------------------
   * @description
   * Computes the total size of all the measured items, unless an estimated item
   * size is supplied.
   * -------------------------------------------------------------------------
   */
  function getTotalSizeOfItems(): number {
    const totalMeasuredSize = getMeasuredSize();

    if (infinite) {
      return totalMeasuredSize;
    }

    const [min, max] = state.current.indexed;
    const numOfUnmeasuredIndexes = numberOfItems - (Math.abs(min) + max);
    const estimatedUnmeasuredSize = numOfUnmeasuredIndexes * estimatedItemSize;

    return totalMeasuredSize + estimatedUnmeasuredSize;
  }

  /**
   * resetFromIndex
   * -------------------------------------------------------------------------
   * @param resetIndex - the starting index from which measurements are retaken
   * via the itemSize prop and finishes at the highest measured index.
   *
   * -------------------------------------------------------------------------
   */
  function resetFromIndex(resetIndex: number): void {
    const safeIndex = getSafeIndex(resetIndex);
    const highestMeasuredIndex = state.current.indexed[1];
    let { offset } = getMeasurements(resetIndex);
    for (let index = safeIndex; index <= highestMeasuredIndex; index += 1) {
      const sizeAtIndex = getItemSize(index);
      setMeasurements(index, { offset, size: sizeAtIndex });
      offset += sizeAtIndex;
    }

    onReset([safeIndex, highestMeasuredIndex]);
  }

  /*
   If a offset value persists between hot reloading or fast refresh, this has
   potential to cause a slow initial load if an offset is very high.  Just
   something to be aware of. 
  */
  useEffect(() => {
    return () => {
      state.current = getInitialState();
    };
  }, []);

  return {
    getMeasurements,
    getTotalSizeOfItems,
    getIndexRangeFromOffsets,
    findIndexAtOffset,
    findClosingIndex,
    resetFromIndex,
    clear,
  };
}

export default useMeasurementsIndexer;
