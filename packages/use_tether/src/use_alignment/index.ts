import { useState, useCallback } from 'react';
import { Alignment } from '../types';
import { ALIGNMENTS_TYPES } from '../constants';

function useAlignment(preference: Alignment = ALIGNMENTS_TYPES.bottom) {
  const [alignment, setAlignment] = useState(preference);

  const set = useCallback((nextAlignment: Alignment) => {
    setAlignment((currentAlignment) => {
      return currentAlignment !== nextAlignment ? nextAlignment : currentAlignment;
    });
  }, []);

  return [alignment, set];
}

export default useAlignment;
