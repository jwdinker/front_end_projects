import { useState, useMemo } from 'react';
import { Alignment, UseAlignmentReturnValue, Align } from './types';
import { ALIGNMENTS_TYPES } from './constants';

function useAlignment(preference: Alignment = ALIGNMENTS_TYPES.bottom): UseAlignmentReturnValue {
  const [alignment, setAlignment] = useState(preference);

  const align = useMemo(() => {
    return Object.keys(ALIGNMENTS_TYPES).reduce((accumulator, key) => {
      accumulator[key] = (): void => setAlignment(key as Alignment);
      return accumulator;
    }, {}) as Align;
  }, []);

  return [alignment, align];
}

export default useAlignment;
