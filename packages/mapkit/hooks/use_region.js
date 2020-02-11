import { useContext, useRef, useEffect, useMemo } from 'react';
import { MapContext } from '../contexts';
import useMapListeners from './use_map_listeners';

function useRegion({ center = [null, null], span = [null, null], animate = false } = {}) {
  const { index, hasMapLoaded } = useContext(MapContext);
  const { Coordinate, CoordinateSpan, CoordinateRegion, Padding, MapRect, CameraZoomRange } = mapkit;

  const latitude = center[0];
  const longitude = center[1];

  const latitudeDelta = span[0];
  const longitudeDelta = span[1];

  const map = useMemo(() => {
    if (hasMapLoaded) {
      return mapkit.maps[index];
    }
    return null;
  }, [hasMapLoaded, index]);

  useEffect(() => {
    const hasProps = !!latitude && !!longitude && latitudeDelta && longitudeDelta;

    if (hasMapLoaded && hasProps) {
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

  return map ? map.region : null;
}

export default useRegion;
