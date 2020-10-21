import preventOverflow from '@jwdinker/prevent-overflow';
import { AbbreviatedRectangle, PreventableOverflowOptions } from '../../types';

function preventableOverflow(
  offsets: AbbreviatedRectangle[],
  boundaries: AbbreviatedRectangle,
  options: PreventableOverflowOptions = {}
) {
  const { allow = [], padding = [] } = options;

  return offsets.map((offset, index) => {
    const value = preventOverflow({
      element: offset,
      boundaries,
      allow,
      padding: padding[index] || undefined,
    });
    return value;
  });
}

export default preventableOverflow;
