import preventOverflow from '@jwdinker/prevent-overflow';
import { AbbreviatedRectangle, PreventableOverflowOptions } from '../../types';

function preventableOverflow(
  offsets: AbbreviatedRectangle[],
  boundaries: AbbreviatedRectangle,
  options: PreventableOverflowOptions = {}
): AbbreviatedRectangle[] {
  const { allow = [], padding = [] } = options;

  return offsets.map((offset, index) => {
    const value = preventOverflow({
      element: offset,
      boundaries,
      allow,
      padding: padding[index] || undefined,
    })[0];
    return value;
  });
}

export default preventableOverflow;
