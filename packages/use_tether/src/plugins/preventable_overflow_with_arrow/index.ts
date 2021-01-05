import preventOverflow from '@jwdinker/prevent-overflow';
import { getTetherablePadding, getArrowPadding } from './helpers';
import { PreventableOverflowWithArrowOptions, TetherableMeasurements } from '../../types';
import inferAlignment from '../../helpers/infer_alignment';

function preventableOverflowWithArrow(
  options: PreventableOverflowWithArrowOptions
): TetherableMeasurements {
  const { anchor, tetherables, boundaries, allow } = options;
  const [arrow, element] = tetherables;

  const alignment = inferAlignment(anchor, tetherables[0]);

  return tetherables.map((measurements, index) => {
    const padding =
      index === 0
        ? getArrowPadding(alignment, arrow, element)
        : getTetherablePadding(alignment, arrow);

    return preventOverflow({
      element: measurements,
      boundaries,
      allow,
      padding,
    })[0];
  });
}

export default preventableOverflowWithArrow;
