/* eslint-disable no-console */
import * as React from 'react';

import { IndexRange, Measurements, UseMeasurementsIndexerProps } from './types';

const { useRef, useCallback } = React;

function useMeasurementsIndexer({
  itemSize = 100,
  estimatedItemSize = 100,
  onMeasure = () => {},
  numberOfItems = -1,
  log = false,
}: UseMeasurementsIndexerProps = {}) {
  const cache = useRef({});
  const indexed = useRef([0, 0]);

  const hasItemLimit = numberOfItems > -1;
  const isFixedItemSize = typeof itemSize === 'number';
  const isVariableItemSize = typeof itemSize === 'function';

  /**
   * setMeasurements
   * ---------------
   * @param index The key of the cached measurements.
   * @param offset The offset of the item.
   * @param size The size of the item.
   */
  const setMeasurements = useCallback(
    (index: number, offset: number, size: number) => {
      const item = { offset, size };
      cache.current[index] = item;
      onMeasure(index, item);
    },
    [onMeasure]
  );

  const setMinIndexed = useCallback((index: number): void => {
    indexed.current[0] = index;
  }, []);

  const setMaxIndexed = (index: number): void => {
    indexed.current[1] = index;
  };

  /**
   * getOffsetAtIndex
   * ----------------
   * @param index The index from which the offset is returned.  If the offset
   * has not been measured yet, zero is returned.  This is an internal helper.
   */
  const getOffsetAtIndex = (index: number): number => {
    const item = cache.current[index];
    if (item) {
      return item.offset;
    }
    return 0;
  };

  /**
   * getSizeAtIndex
   * ----------------
   * @param index The index from which the size is returned.  If the size
   * has not been measured yet, zero is returned.  This is an internal helper.
   */
  const getSizeAtIndex = (index: number): number => {
    const item = cache.current[index];
    if (item) {
      return item.size;
    }
    return 0;
  };

  /**
   * getItemSize
   * -----------
   * @param index - index of the measurement about to be taken.
   * @param offset - offset of the previously measured item.
   * @description
   * A conditional helper function for determining whether to retreive the size
   * of the item at index from a callback or just return a numbered parameter.
   */
  const getItemSize = (index: number, offset: number): number => {
    return typeof itemSize === 'function' ? itemSize(index, offset) : itemSize;
  };

  /**
   * measureDownToMinIndex
   * ---------------------
   * @param stopIndex The index at which the backwards iterating loop will cease.
   * @description
   * - utilized when an item is able to have an offset less than 0.
   * - the starting index is set to the lowest measured index -1 in order to
   *   make sure atleast 1 measurement behind the lowest measured index is
   *   taken.
   * - Since offsets are measured into the negative, the accumulating offset
   *   is subtracted.
   * - Once, the index is greater than or equal to the stopIndex the loop
   *   ceases and the stopIndex becomes the new lowest measured index.
   */
  const measureDownToMinIndex = (stopIndex: number): void => {
    // console.log('%c↓ measuring', 'background:red;color:white;');
    const lowestMeasuredIndex = indexed.current[0];
    let offset = getOffsetAtIndex(lowestMeasuredIndex);

    for (let index = lowestMeasuredIndex - 1; index >= stopIndex; index -= 1) {
      const sizeAtIndex = getSizeAtIndex(index) || getItemSize(index, offset);

      if (log) {
        console.log(
          // '%c ▼ measuring',
          'background:#ffcc00;color:black;',
          `\tindex:${index}\n\tsize:${sizeAtIndex}\n\toffset:${offset}\n\n`
        );
      }

      offset -= sizeAtIndex;
      setMeasurements(index, offset, sizeAtIndex);
    }
    setMinIndexed(stopIndex);
  };

  /**
   * measureUptoMaxIndex
   * -------------------
   * @param stopIndex The index at which the forward iterating loop will cease.
   * @description
   * - utilized when an item is able to have an offset greather than 0.
   * - the starting index is set to the highest measured index +1 in order to
   *   make sure at least 1 measurement in front of the highest measured index
   *   is taken.
   * - Since offsets are measured in the postive, the accumulating offset is
   *   added.
   * - Once, the index is greater than or equal to the stopIndex the loop ceases
   *   and the stopIndex becomes the new highest measured index.
   */
  const measureUpToMaxIndex = (stopIndex: number): void => {
    const highestMeasuredIndex = indexed.current[1];
    let offset = getOffsetAtIndex(highestMeasuredIndex);
    const isInitial = stopIndex === 0 && highestMeasuredIndex === 0;

    for (let index = highestMeasuredIndex; index <= stopIndex; index += 1) {
      // make sure the getSize is only taken once so surrounding offsets aren't accidently invalidated.
      const sizeAtIndex = getSizeAtIndex(index) || getItemSize(index, offset);
      const canMeasure = isInitial || index > highestMeasuredIndex;
      if (canMeasure) {
        if (log) {
          console.log(
            '%c ▲ measuring',
            'background:#3fd760;color:black;',
            `\tindex:${index}\n\tsize:${sizeAtIndex}\n\toffset:${offset}\n\n`
          );
        }
        // console.log('%c↑ measuring', 'background:green;color:white;', index, stopIndex);
        setMeasurements(index, offset, sizeAtIndex);
      }

      offset += sizeAtIndex;
    }

    setMaxIndexed(stopIndex);
  };

  /**
   * measure
   * ------------------------
   * @param index - The index to measure.
   * @description
   *- acts as a delegator.
   *- if the index is less than the lowest measured index that probably means
   *  some type of infinite scrolling via a transform is being used and
   *  measurements are going to be negative.
   *- if the index is greater than the highest measured index, the offset is
   *  moving forward and no measurements exist within that range yet.
   */
  const measure = (index: number): void => {
    if (index < indexed.current[0]) {
      measureDownToMinIndex(index);
      return;
    }

    measureUpToMaxIndex(index);
  };

  /**
   * getMeasurements
   * ------------------------------
   * @param index The index used to retreive the measurements from the cache.
   * @description
   * - checks if the measurements at that index exist by seeing if there are
   *     within the range of the lowest and highest measured indexes.
   * - if that particular index has not been measured yet, the measurements are
   *      taken via itemSize and cached by the index.
   * - if the measurements already existed or the measurements were just taken,
   *   they are returned.
   */
  const getMeasurements = (index: number): Measurements => {
    let measurements = cache.current[index];

    if (!measurements) {
      measure(index);
      measurements = cache.current[index];
    }

    return measurements;
  };

  const binarySearch = (offset: number): number => {
    let [low, high] = indexed.current;

    while (low <= high) {
      const middle = low + Math.floor((high - low) / 2);
      const value = getMeasurements(middle).offset;

      if (value === offset) {
        return middle;
      }
      if (value < offset) {
        low = middle + 1;
      } else if (value > offset) {
        high = middle - 1;
      }
    }

    if (low > 0) {
      return low - 1;
    }
    return low;
  };

  const exponentialSearch = (offset: number): number => {
    const [min, max] = indexed.current;
    const isBackwards = offset < 0;
    const isForwards = offset >= 0;
    let interval = 1;
    let index = isForwards ? Math.max(0, max) : Math.min(min, 0);

    if (isForwards) {
      while (getMeasurements(index).offset < offset) {
        index += interval;
        interval *= 2;
      }
    }

    if (isBackwards) {
      while (getMeasurements(index).offset > offset) {
        index -= interval;
        interval *= -2;
      }
    }

    return binarySearch(offset);
  };

  /**
   * findClosestIndexToOffset
   * ------------------------------
   * @param offset The offset used to find the closest matching index
   * by iterating through cached offsets.
   * @description
   * - The highest and lowest offsets are retreived in order to see if the
   *   offset argument is within the range that has already been measured. The
   *   one exception this will run in an unmeasured range is when the first
   *   measurement is taken as there is no measurement cached
   */
  const findClosestIndexToOffset = (offset: number): number => {
    const [min, max] = indexed.current;

    const highestOffset = getOffsetAtIndex(max);
    const lowestOffset = getOffsetAtIndex(min);

    const inMeasuredRange = highestOffset <= offset && offset >= lowestOffset;
    if (inMeasuredRange) {
      return binarySearch(offset);
    }
    return exponentialSearch(offset);
  };

  /**
   * getEndIndex
   * ------------------------------
   * @param startIndex The index used to retreive the starting offset of the
   * accumlating size.
   * @param threshold The amount to add to the start index's offset in order to
   * determine the stop index.
   *
   * @description
   * - The start index's offset is used as a starting point.
   * - The threshold determines how far past the start index the measuring
   *   should be done.
   * - The loop can run indefinitely for use cases like infinite scrolling
   *   unless a number of items is supplied.
   */
  const getEndIndex = (startIndex: number, threshold: number): number => {
    let accumlatingSize = getMeasurements(startIndex).offset;
    let endIndex = startIndex;
    const hasStopPoint = numberOfItems > -1;

    while (
      (accumlatingSize < threshold && !hasStopPoint) ||
      (accumlatingSize < threshold && hasStopPoint && endIndex < numberOfItems - 1)
    ) {
      endIndex += 1;
      const currentSize = getMeasurements(endIndex).size;

      if (typeof currentSize === 'undefined') {
        throw new Error(
          `An error occured attempting to find the stop index.  A size must exist for index ${endIndex}.`
        );
      }

      accumlatingSize += currentSize;
    }
    return endIndex;
  };

  /**
   * getIndexRangeFromOffsets
   * ------------------------
   * @param startOffset The offset used to find the start of the index segment.
   * @param endOffset The offset used to find the end of the index segment.
   */
  const getIndexRangeFromOffsets = (startOffset: number, endOffset: number): IndexRange => {
    if (endOffset < startOffset) {
      throw new Error(
        `getIndexRangeFromOffsets requires the endOffset be greater than the startOffset`
      );
    }
    const startIndex = findClosestIndexToOffset(startOffset);
    const endIndex = getEndIndex(startIndex, endOffset);
    return [startIndex, endIndex];
  };

  /**
   * clearMeasurements
   * -----
   * @description
   * - Clears the measurements cache and resets the lowest and highest measured
   *   indexes back to 0.
   * - Primary use case is if the measurements change, the cache needs to be cleared.
   */
  const clearMeasurements = (): void => {
    cache.current = {};
    indexed.current = [0, 0];
  };

  /**
   * getTotalSize
   * ------------
   * @description
   * - The real total size will be calculated if one of the following condtions
   *   are met:
   *  - There is a set number of items AND the item size is a number meaning its
   *    a fixed size.
   *  - There is a set number of items AND there is an estimated item size which
   *    means the total can be calculated up witht he sum of the measured total
   *    and unmeasured total multiplied by the estimated size.
   * - Otherwise, only the measured size is calculated.  The use case for this
   *   is hacks with a transform where the total size won't matter.
   */
  const getTotalSize = (): number => {
    const [min, max] = indexed.current;
    const totalMeasuredSize = Math.abs(getMeasurements(min).offset) + getMeasurements(max).offset;

    const hasEstimatedItemSize = estimatedItemSize > 0;

    if (hasItemLimit) {
      if (isFixedItemSize) {
        return (itemSize as number) * (numberOfItems - 1);
      }

      if (isVariableItemSize && hasEstimatedItemSize) {
        const lastIndex = numberOfItems - 1;
        const unmeasuredIndexes = Math.abs(min) + max;
        const estimatedUnmeasuredSize = (lastIndex - unmeasuredIndexes) * estimatedItemSize;
        return totalMeasuredSize + estimatedUnmeasuredSize;
      }
    }

    return totalMeasuredSize;
  };

  return {
    getMeasurements,
    getIndexByOffset: findClosestIndexToOffset,
    getIndexRangeFromOffsets,
    clearMeasurements,
    getTotalSize,
  };
}

export default useMeasurementsIndexer;
