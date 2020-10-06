import { useContext, useRef, useEffect, useMemo } from 'react';
import { MapContext } from '../contexts';

function useRegion({ center = [null, null], span = [null, null], animate = false } = {}) {
  const { index, hasMapLoaded } = useContext(MapContext);
  const { mapkit } = window;
  const {
    Coordinate,
    CoordinateSpan,
    CoordinateRegion,
    Padding,
    MapRect,
    CameraZoomRange,
  } = mapkit;

  const latitude = center[0];
  const longitude = center[1];

  const latitudeDelta = span[0];
  const longitudeDelta = span[1];

  const map = useMemo(() => {
    if (hasMapLoaded) {
      return window.mapkit.maps[index];
    }
    return null;
  }, [hasMapLoaded, index]);

  useEffect(() => {
    const hasProps = !!latitude && !!longitude && latitudeDelta && longitudeDelta;

    if (hasMapLoaded && hasProps && !!map) {
      const coordinate = new Coordinate(latitude, longitude);
      const _span = new CoordinateSpan(latitudeDelta, longitudeDelta);
      const region = new CoordinateRegion(coordinate, _span);
      map.setRegionAnimated(region, animate);
    }
  }, [
    CameraZoomRange,
    Coordinate,
    CoordinateRegion,
    CoordinateSpan,
    animate,
    hasMapLoaded,
    latitude,
    latitudeDelta,
    longitude,
    longitudeDelta,
    map,
  ]);
}

export default useRegion;
