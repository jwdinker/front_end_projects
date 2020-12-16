import { Boundaries, GetMeasurements, MeasurementIndexerState } from './types';

export function validateOffsetRange(startOffset: number, endOffset: number): void {
  if (endOffset < startOffset) {
    throw new Error(
      `getIndexRangeFromOffsets requires the endOffset be greater than the startOffset`
    );
  }
}

export function getNumberOfItems(boundaries: Boundaries): number {
  const [lower, upper] = boundaries;
  if (lower === 0 && upper === -1) {
    return 0;
  }
  const higherNum = Math.max(lower, upper);
  const lowerNum = Math.min(lower, upper);
  return Math.abs(Math.abs(higherNum) - Math.abs(lowerNum));
}

export function getInitialState(): MeasurementIndexerState {
  return {
    indexed: [0, -1],
    cache: {},
  };
}

export function isBackwards(value: number): boolean {
  return value < 0;
}

export function isForwards(value: number): boolean {
  return value >= 0;
}

export function binarySearch(
  indexed: number[],
  threshold: number,
  getOffset: GetMeasurements
): number {
  let [low, high] = indexed;

  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);

    const { offset, size } = getOffset(middle);
    let value = offset;

    /*
      since it's possible to have a negative min indexed value, the offset needs
      to be adjusted slightly by the size, otherwise, elements at the edges may
      not appear.
    */
    if (middle < 0) {
      value += size;
    }

    if (value === threshold) {
      return middle;
    }
    if (value < threshold) {
      low = middle + 1;
    } else if (value > threshold) {
      high = middle - 1;
    }
  }

  if (low > 0) {
    return low - 1;
  }
  return low;
}
