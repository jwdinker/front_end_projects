import preventOverflow from '@jwdinker/prevent-overflow';
import { PREVENT_OVERFLOW_BEHAVIOR } from '../../constants';
import inferAlignment from '../../helpers/infer_alignment';
import { PreventableOverflowOptions, PreventableOverflowReturn } from '../../types';

function preventableOverflow(options: PreventableOverflowOptions): PreventableOverflowReturn {
  const {
    anchor,
    tetherables,
    boundaries,
    allow = [],
    behavior = PREVENT_OVERFLOW_BEHAVIOR.COLLAPSE,
  } = options;
  const alignment = inferAlignment(anchor, tetherables[0]);

  const isY = alignment === 'top' || alignment === 'bottom';
  const dimension = isY ? 'height' : 'width';
  const isTopOrLeft = alignment === 'top' || alignment === 'left';
  const isBottomOrRight = alignment === 'bottom' || alignment === 'right';

  let paddingBefore = 0;
  let paddingAfter = tetherables.reduce(
    (accumulator, offsets) => accumulator + offsets[dimension] * -1,
    0
  );

  let startPaddingType = 'left';
  let endPaddingType = 'right';
  if (isY) {
    startPaddingType = 'top';
    endPaddingType = 'bottom';
  }

  const measurements: PreventableOverflowReturn = [];

  if (behavior === PREVENT_OVERFLOW_BEHAVIOR.STACK) {
    if (isTopOrLeft) {
      for (let i = tetherables.length - 1; i >= 0; i -= 1) {
        const tetherable = tetherables[i];

        paddingAfter += tetherable[dimension];

        const value = preventOverflow({
          element: tetherable,
          boundaries,
          allow,
          padding: {
            [startPaddingType]: paddingBefore,
            [endPaddingType]: paddingAfter,
          },
        })[0];

        paddingBefore += tetherable[dimension];

        measurements.unshift(value);
      }
    }

    if (isBottomOrRight) {
      for (let i = 0; i < tetherables.length; i += 1) {
        const tetherable = tetherables[i];

        paddingAfter += tetherable[dimension];

        const value = preventOverflow({
          element: tetherable,
          boundaries,
          allow,
          padding: {
            [startPaddingType]: paddingBefore,
            [endPaddingType]: paddingAfter,
          },
        })[0];

        paddingBefore += tetherable[dimension];

        measurements.push(value);
      }
    }
  } else {
    for (let i = 0; i < tetherables.length; i += 1) {
      const tetherable = tetherables[i];
      const value = preventOverflow({
        element: tetherable,
        boundaries,
        allow,
      })[0];
      measurements.push(value);
    }
  }

  return measurements;
}

export default preventableOverflow;
