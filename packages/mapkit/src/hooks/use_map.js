import { useContext, useMemo, useRef, useEffect, useCallback } from 'react';
import { MapContext } from '../contexts';
import { usePrevious } from '../internal';

// {
//   colorScheme = 'light',
//   tintColor = 'black',
//   mapType = 'standard',
//   showsCompass = 'adaptive',
//   showsMapTypeControl = false,
//   showsZoomControl = false,
//   showsUserLocationControl = false,
//   showsScale = 'adaptive',

//   // Interaction
//   isRotationEnabled = true,
//   isScrollEnabled = true,
//   isZoomEnabled = true,
// }

const DEFAULT_PROPS = {
  colorScheme: 'light',
  tintColor: 'black',
  mapType: 'standard',
  showsCompass: 'adaptive',
  showsMapTypeControl: false,
  showsZoomControl: false,
  showsUserLocationControl: false,
  showsScale: 'adaptive',

  // Interaction
  isRotationEnabled: true,
  isScrollEnabled: true,
  isZoomEnabled: true,
};

const propKeys = Object.keys(DEFAULT_PROPS);

function useMap(ref, props = DEFAULT_PROPS) {
  const { setIndex, resetIndex, hasMapLoaded } = useContext(MapContext);
  const previousProps = usePrevious(props);

  const map = useRef();

  useEffect(() => {
    if (!hasMapLoaded) {
      const { Map, maps } = window.mapkit;
      if (ref.current) {
        map.current = new Map(ref.current, props);

        const index = maps.length - 1;

        setIndex(index);
      }
    }
  }, [hasMapLoaded, props, ref, resetIndex, setIndex]);

  useEffect(() => {
    if (map.current && typeof previousProps !== 'undefined') {
      propKeys.forEach((key) => {
        if (previousProps[key] !== props[key]) {
          map.current[key] = props[key];
        }
      });
    }
  }, [previousProps, props]);

  useEffect(() => {
    if (map.current) {
      return () => {
        resetIndex();
        map.current.destroy();
      };
    }
  }, [resetIndex]);

  // const showItems = useCallback(
  //   (items, { animate = false, padding = null } = {}) => {
  //     if (hasMapLoaded) {
  //       const _padding = padding
  //         ? new window.mapkit.Padding(Object.values(padding))
  //         : new window.mapkit.Padding(0, 0, 0, 0);

  //       if (items) {
  //         map.current.showItems(Array.isArray(items) ? items : [items], {
  //           animate,
  //           padding: _padding,
  //         });
  //       }
  //     }
  //   },
  //   [hasMapLoaded]
  // );

  // const getAnnotations = useCallback(() => {
  //   if (hasMapLoaded) {
  //     return map.current.annotations;
  //   }
  // }, [hasMapLoaded]);

  // const getOverlays = useCallback(() => {
  //   if (hasMapLoaded) {
  //     return map.current.overlays;
  //   }
  // }, [hasMapLoaded]);

  // return { getAnnotations, getOverlays, showItems };
}

export default useMap;
