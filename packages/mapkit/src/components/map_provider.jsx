import React, { Component, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { MapContext } from '../contexts';
import { useInstance } from '../internal';

function MapProvider({ children }) {
  const [index, _setIndex] = useState(-1);

  const setIndex = useCallback(async (mapIndex) => {
    return _setIndex((previousIndex) => {
      if (previousIndex > -1) {
        throw new Error('MapProvider and withMap only allows for 1 useMap hook.');
      }
      return mapIndex;
    });
  }, []);

  const resetIndex = useCallback(() => {
    return _setIndex(-1);
  }, []);

  const value = useMemo(() => {
    return {
      hasMapLoaded: index > -1,
      index,
      setIndex,
      resetIndex,
    };
  }, [index, resetIndex, setIndex]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export default MapProvider;
