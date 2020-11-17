import { Dimensions } from '@jwdinker/use-dimensions-list';
import { AbbreviatedRectangle } from '@jwdinker/prevent-overflow';
import { Alignment, CoordinateFromPosition } from '../types';
import { ALIGNMENTS_KEYS } from '../constants';

export const coordinateFromPosition: CoordinateFromPosition = {
  top: (coordinates, dimensions) => coordinates.top - dimensions.height,
  centerX: (coordinates, dimensions) =>
    coordinates.left - (dimensions.width - coordinates.width) / 2,
  centerY: (coordinates, dimensions) =>
    coordinates.top - (dimensions.height - coordinates.height) / 2,
  bottom: (coordinates) => coordinates.top + coordinates.height,
  left: (coordinates, dimensions) => coordinates.left - dimensions.width,
  right: (coordinates) => coordinates.left + coordinates.width,
};

export const makeTetheredOffsets = (
  anchorOffsets: AbbreviatedRectangle,
  dimensionsOfTethered: Dimensions[],
  alignment: Alignment
) => {
  const tetheredOffsets: AbbreviatedRectangle[] = [];
  const [xType, yType] = ALIGNMENTS_KEYS[alignment];

  for (let index = 0; index < dimensionsOfTethered.length; index += 1) {
    const dimensions = dimensionsOfTethered[index];
    // if there is more than one element reference, the position of previous element is used.
    const baseCoordinates = index === 0 ? anchorOffsets : tetheredOffsets[index - 1];
    const top = coordinateFromPosition[yType](baseCoordinates, dimensions);
    const left = coordinateFromPosition[xType](baseCoordinates, dimensions);

    tetheredOffsets.push({
      top,
      left,
      ...dimensions,
    });
  }
  return tetheredOffsets;
};
