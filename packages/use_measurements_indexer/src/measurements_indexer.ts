/* eslint-disable react/static-property-placement */
import autobind from 'auto-bind';
import {
  IndexRange,
  MeasurementIndexerState,
  Measurements,
  MeasurementsIndexerProps,
} from './types';
import { print } from './helpers';

class MeasurementsIndexer {
  state: MeasurementIndexerState;

  props: MeasurementsIndexerProps;

  constructor(props: MeasurementsIndexerProps) {
    const {
      numberOfItems = -1,
      itemSize = 100,
      log = false,
      estimatedItemSize = 0,
      onMeasure,
      onReset,
      onClear,
    } = props;

    this.state = {
      indexed: [0, 0],
      cache: {},
    };

    this.props = {
      numberOfItems,
      itemSize,
      log,
      estimatedItemSize,
      onMeasure,
      onReset,
      onClear,
    };
    // autobinding all the prototype functions is done in order to maintain
    // context if prop spreading is used.
    autobind(this);
  }

  hasItemLimit() {
    return this.props.numberOfItems > -1;
  }

  private isFixedItemSize() {
    return typeof this.props.itemSize === 'number';
  }

  private isVariableItemSize() {
    return typeof this.props.itemSize === 'function';
  }

  private hasEstimatedItemSize() {
    return this.props.estimatedItemSize && this.props.estimatedItemSize > 0;
  }

  private setMinIndexed(index: number): void {
    this.state.indexed[0] = index;
  }

  private setMaxIndexed(index: number): void {
    this.state.indexed[1] = index;
  }

  /**
   * setMeasurements
   * ---------------
   * @param index The key of the cached measurements.
   * @param offset The offset of the item.
   * @param size The size of the item.
   */
  private setMeasurements(index: number, offset: number, size: number) {
    const item = { offset, size };
    this.state.cache[index] = item;

    if (typeof this.props.onMeasure !== 'undefined') {
      this.props.onMeasure(index, item);
    }
  }

  /**
   * getOffsetAtIndex
   * ----------------
   * @param index The index from which the offset is returned.  If the offset
   * has not been measured yet, zero is returned.  This is an internal helper.
   */
  public getOffsetAtIndex(index: number): number {
    const item = this.state.cache[index];
    if (item) {
      return item.offset;
    }
    return 0;
  }

  /**
   * getSizeAtIndex
   * ----------------
   * @param index The index from which the size is returned.  If the size
   * has not been measured yet, zero is returned.  This is an internal helper.
   */
  public getSizeAtIndex(index: number): number {
    const item = this.state.cache[index];
    if (item) {
      return item.size;
    }
    return 0;
  }

  /**
   * getItemSize
   * -----------
   * @param index - index of the measurement about to be taken.
   * @param offset - offset of the previously measured item.
   * @description
   * A conditional helper function for determining whether to retreive the size
   * of the item at index from a callback or just return a numbered parameter.
   */
  private getItemSize(index: number, offset = 0): number {
    return typeof this.props.itemSize === 'function'
      ? this.props.itemSize(index, offset)
      : this.props.itemSize;
  }

  private getEstimatedItemSize() {
    const { estimatedItemSize } = this.props;
    return estimatedItemSize && estimatedItemSize > 0 ? estimatedItemSize : 0;
  }

  private getNumberOfItems() {
    return this.props.numberOfItems;
  }

  private getFixedItemSize(): number {
    return typeof this.props.itemSize === 'function' ? 0 : this.props.itemSize;
  }

  /**
   * resetFromIndex
   * --------------
   * @param resetIndex - the starting index from which measurements are retaken
   * via the itemSize prop and finishes at the highest measured index.
   */
  public resetFromIndex(resetIndex: number): void {
    const highestMeasuredIndex = this.state.indexed[1];
    let offset = this.getOffsetAtIndex(resetIndex);
    for (let index = resetIndex; index <= highestMeasuredIndex; index += 1) {
      const sizeAtIndex = this.getItemSize(index, offset);

      this.setMeasurements(index, offset, sizeAtIndex);
      offset += sizeAtIndex;
    }
    if (typeof this.props.onReset === 'function') {
      this.props.onReset([resetIndex, highestMeasuredIndex]);
    }
  }

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
  private measureDownToMinIndex(stopIndex: number): void {
    const lowestMeasuredIndex = this.state.indexed[0];
    let offset = this.getOffsetAtIndex(lowestMeasuredIndex);

    for (let index = lowestMeasuredIndex - 1; index >= stopIndex; index -= 1) {
      const sizeAtIndex = this.getSizeAtIndex(index) || this.getItemSize(index, offset);

      if (this.props.log) {
        print(1, index, sizeAtIndex, offset);
      }

      offset -= sizeAtIndex;
      this.setMeasurements(index, offset, sizeAtIndex);
    }
    this.setMinIndexed(stopIndex);
  }

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
  private measureUpToMaxIndex(stopIndex: number): void {
    const highestMeasuredIndex = this.state.indexed[1];
    let offset = this.getOffsetAtIndex(highestMeasuredIndex);
    const isInitial = stopIndex === 0 && highestMeasuredIndex === 0;

    for (let index = highestMeasuredIndex; index <= stopIndex; index += 1) {
      // make sure the getSize is only taken once so surrounding offsets aren't accidently invalidated.
      const sizeAtIndex = this.getSizeAtIndex(index) || this.getItemSize(index, offset);
      const canMeasure = isInitial || index > highestMeasuredIndex;
      if (canMeasure) {
        if (this.props.log) {
          print(0, index, sizeAtIndex, offset);
        }

        this.setMeasurements(index, offset, sizeAtIndex);
      }

      offset += sizeAtIndex;
    }

    this.setMaxIndexed(stopIndex);
  }

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
  private measure(index: number): void {
    if (index < this.state.indexed[0]) {
      this.measureDownToMinIndex(index);
      return;
    }

    this.measureUpToMaxIndex(index);
  }

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
  public getMeasurements(index: number): Measurements {
    let measurements = this.state.cache[index];

    if (!measurements) {
      this.measure(index);
      measurements = this.state.cache[index];
    }

    return measurements;
  }

  private binarySearch(offset: number): number {
    let [low, high] = this.state.indexed;

    while (low <= high) {
      const middle = low + Math.floor((high - low) / 2);
      const value = this.getMeasurements(middle).offset;

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
  }

  private exponentialSearch(offset: number): number {
    const [min, max] = this.state.indexed;
    const isBackwards = offset < 0;
    const isForwards = offset >= 0;
    let interval = 1;
    let index = isForwards ? Math.max(0, max) : Math.min(min, 0);

    if (isForwards) {
      while (this.getMeasurements(index).offset < offset) {
        index += interval;
        interval *= 2;
      }
    }

    if (isBackwards) {
      while (this.getMeasurements(index).offset > offset) {
        index -= interval;
        interval *= -2;
      }
    }

    return this.binarySearch(offset);
  }

  /**
   * getIndexByOffset
   * ------------------------------
   * @param offset The offset used to find the closest matching index
   * by iterating through cached offsets.
   * @description
   * - The highest and lowest offsets are retreived in order to see if the
   *   offset argument is within the range that has already been measured. The
   *   one exception this will run in an unmeasured range is when the first
   *   measurement is taken as there is no measurement cached
   */
  public getIndexByOffset(offset: number): number {
    const [min, max] = this.state.indexed;

    const highestOffset = this.getOffsetAtIndex(max);
    const lowestOffset = this.getOffsetAtIndex(min);

    const inMeasuredRange = highestOffset <= offset && offset >= lowestOffset;
    if (inMeasuredRange) {
      return this.binarySearch(offset);
    }
    return this.exponentialSearch(offset);
  }

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
  public getEndIndex(startIndex: number, threshold: number): number {
    let accumlatingSize = this.getMeasurements(startIndex).offset;

    const isInfinite = this.props.numberOfItems === -1;
    let endIndex = startIndex;
    let isSeaching = true;

    while (isSeaching) {
      const currentSize = this.getMeasurements(endIndex).size;

      if (typeof currentSize === 'undefined') {
        throw new Error(
          `An error occured attempting to find the stop index.  A size must exist for index ${endIndex}.`
        );
      }

      accumlatingSize += currentSize;

      const isUnderThreshold = accumlatingSize <= threshold;
      const hasReachedEnd = !isInfinite && endIndex >= this.props.numberOfItems - 1;
      if (isUnderThreshold) {
        if (!hasReachedEnd || isInfinite) {
          endIndex += 1;
        }
      } else {
        isSeaching = false;
      }
    }
    return endIndex;
  }

  /**
   * getIndexRangeFromOffsets
   * ------------------------
   * @param startOffset The offset used to find the start of the index segment.
   * @param endOffset The offset used to find the end of the index segment.
   */
  public getIndexRangeFromOffsets(startOffset: number, endOffset: number): IndexRange {
    if (endOffset < startOffset) {
      throw new Error(
        `getIndexRangeFromOffsets requires the endOffset be greater than the startOffset`
      );
    }
    /*
     zero must be offered up as an alternative when rubberband scrolling returns
     a negative value and the index doesn't exist. 
    */
    const startIndex = this.getIndexByOffset(startOffset) || 0;
    const endIndex = this.getEndIndex(startIndex, endOffset);
    return [startIndex, endIndex];
  }

  /**
   * clear
   * -----
   * @description
   * - Clears the measurements cache and resets the lowest and highest measured
   *   indexes back to 0.
   * - Primary use case is if the measurements change, the cache needs to be cleared.
   */
  public clear(): void {
    this.state = {
      cache: {},
      indexed: [0, 0],
    };
    if (typeof this.props.onClear === 'function') {
      this.props.onClear();
    }
  }

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
  public getTotalSize(): number {
    const [min, max] = this.state.indexed;
    const totalMeasuredSize =
      Math.abs(this.getMeasurements(min).offset) + this.getMeasurements(max).offset;

    const estimatedItemSize = this.getEstimatedItemSize();
    const numberOfItems = this.getNumberOfItems();
    const fixedItemSize = this.getFixedItemSize();

    if (this.hasItemLimit()) {
      if (this.isFixedItemSize()) {
        return fixedItemSize * numberOfItems;
      }

      if (this.isVariableItemSize() && this.hasEstimatedItemSize()) {
        const lastIndex = numberOfItems - 1;
        const unmeasuredIndexes = Math.abs(min) + max;
        const estimatedUnmeasuredSize = (lastIndex - unmeasuredIndexes) * estimatedItemSize;
        return totalMeasuredSize + estimatedUnmeasuredSize;
      }
    }

    return totalMeasuredSize;
  }

  public updateProps(props: MeasurementsIndexerProps) {
    this.props = props;
  }
}

export default MeasurementsIndexer;
