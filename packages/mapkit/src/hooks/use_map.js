import { useContext, useMemo, useRef, useEffect, useCallback } from 'react';
import { MapContext } from '../contexts';

function useMap(
  ref,
  {
    colorScheme = 'light',
    tintColor = 'black',
    mapType = 'standard',
    showsCompass = 'adaptive',
    showsMapTypeControl = false,
    showsZoomControl = false,
    showsUserLocationControl = false,
    showsScale = 'adaptive',

    //Interaction
    isRotationEnabled = true,
    isScrollEnabled = true,
    isZoomEnabled = true,
  } = {}
) {
  const { setIndex, hasMapLoaded } = useContext(MapContext);
  const { Coordinate, CoordinateSpan, CoordinateRegion, Padding, MapRect, CameraZoomRange } = mapkit;

  const map = useRef();

  useEffect(() => {
    const { Map, maps } = mapkit;
    if (ref.current) {
      map.current = new Map(ref.current, {
        colorScheme,
        tintColor,
        mapType,
        showsCompass,
        showsMapTypeControl,
        showsZoomControl,
        showsUserLocationControl,
        showsScale,
        isRotationEnabled,
        isScrollEnabled,
        isZoomEnabled,
      });

      const index = maps.length - 1;

      setIndex(index);

      return () => {
        setIndex(-1);
        map.current.destroy();
      };
    }
  }, [
    colorScheme,
    isRotationEnabled,
    isScrollEnabled,
    isZoomEnabled,
    mapType,
    ref,
    setIndex,
    showsCompass,
    showsMapTypeControl,
    showsScale,
    showsUserLocationControl,
    showsZoomControl,
    tintColor,
  ]);

  const showItems = useCallback(
    (items, { animate = false, padding = null } = {}) => {
      if (hasMapLoaded) {
        const _padding = padding ? new Padding(Object.values(padding)) : new Padding(0, 0, 0, 0);

        if (items) {
          map.current.showItems(Array.isArray(items) ? items : [items], { animate, padding: _padding });
        }
      }
    },
    [Padding, hasMapLoaded]
  );

  const getAnnotations = useCallback(() => {
    if (hasMapLoaded) {
      return map.current.annotations;
    }
  }, [hasMapLoaded]);

  const getOverlays = useCallback(() => {
    if (hasMapLoaded) {
      return map.current.overlays;
    }
  }, [hasMapLoaded]);

  return { getAnnotations, getOverlays, showItems };
}

export default useMap;
