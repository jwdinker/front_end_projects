import { ModifyProps, ModifyReturn } from '../types';
import {
  arrowable,
  flippable,
  flippableWithArrow,
  preventableOverflow,
  preventableOverflowWithArrow,
} from '../plugins';
import { BOUNDARY_FLIP_ALTERNATIVES, PREVENT_OVERFLOW_BEHAVIOR } from '../constants';
import inferAlignment from './infer_alignment';

function modify(props: ModifyProps): ModifyReturn {
  const {
    tetherables,
    anchor,
    boundaries,
    overflow = [],
    at = BOUNDARY_FLIP_ALTERNATIVES,
    hasArrow,
    preference = 'bottom',
    behavior = PREVENT_OVERFLOW_BEHAVIOR.COLLAPSE,
  } = props;

  const alignment = inferAlignment(anchor, tetherables[0]);

  const canPreventOverflow = overflow.length <= 4;

  if (hasArrow) {
    const measurementsWithArrow = arrowable(tetherables, anchor);

    const nextAlignment = at
      ? flippableWithArrow({
          anchor,
          tetherables,
          boundaries,
          preference,
          at,
        })
      : alignment;

    const offsetsWithPreventOverflow = canPreventOverflow
      ? preventableOverflowWithArrow({
          anchor,
          tetherables: measurementsWithArrow,
          boundaries,
          allow: overflow,
        })
      : measurementsWithArrow;

    return [offsetsWithPreventOverflow, nextAlignment];
  }

  const nextAlignment = at
    ? flippable({
        anchor,
        tetherables,
        boundaries,
        preference,
        at,
      })
    : alignment;

  const offsetsWithPreventOverflow = canPreventOverflow
    ? preventableOverflow({
        anchor,
        tetherables,
        boundaries,
        allow: overflow,
        behavior,
      })
    : tetherables;

  return [offsetsWithPreventOverflow, nextAlignment];
}

export default modify;
