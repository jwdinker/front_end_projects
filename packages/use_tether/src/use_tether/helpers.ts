import { CoordinateFromPosition } from '../types';

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
