import { CoordinateFromPosition, AbbreviatedRectangle } from '../types';

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

interface GetStylesOptions {
  raw?: boolean;
  fixed?: boolean;
}

interface TetheredStyleProps {
  top: number;
  left: number;
  rotate?: number;
  height?: number;
  width?: number;
}

function getTranform(unformattedTransform: TetheredStyleProps) {
  const { top, left, rotate } = unformattedTransform;
  let transform = `translate3d(${left}px,${top}px,0px)`;
  if (typeof rotate !== 'undefined') {
    transform += ` rotate(${rotate}deg)`;
  }
  return transform;
}

function makeStyle(measurements: TetheredStyleProps, style: CSSStyleDeclaration) {
  const transform = getTranform(measurements);

  return {
    ...style,
    transform,
    top: 0,
    left: 0,
  };
}

export function getStyles(
  measurements: AbbreviatedRectangle | AbbreviatedRectangle[],
  style: CSSStyleDeclaration
) {
  if (Array.isArray(measurements)) {
    return measurements.map((measurement) => makeStyle(measurement, style));
  }
  return makeStyle(measurements, style);
}
