import { TetheredTransform } from '../types';
import getTranform from './get_transform';

function makeStyle(measurements: TetheredTransform, style: CSSStyleDeclaration) {
  const transform = getTranform(measurements);
  return {
    ...style,
    transform,
    top: 0,
    left: 0,
  };
}

function getStyles(
  measurements: TetheredTransform | TetheredTransform[],
  style: CSSStyleDeclaration
) {
  if (Array.isArray(measurements)) {
    return measurements.map((measurement) => makeStyle(measurement, style));
  }
  return makeStyle(measurements, style);
}

export default getStyles;
