import { useContext, useRef, useEffect, useMemo } from 'react';
import { MapContext } from '../contexts';

function useCamera({
  altitude = 0,
  center = [null, null],
  span = [null, null],
  zoom = [null, null],
  animate = false,
} = {}) {
  const { index, hasMapLoaded } = useContext(MapContext);
  const { Coordinate, CoordinateSpan, CoordinateRegion, Padding, MapRect, CameraZoomRange } = mapkit;

  const min = zoom[0];
  const max = zoom[1];

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
    const hasProps = !!min && !!max;
    if (hasMapLoaded && hasProps) {
      const cameraZoomRange = new CameraZoomRange(min, max);
      map.setCameraZoomRangeAnimated(cameraZoomRange, animate);
    }
  }, [CameraZoomRange, animate, hasMapLoaded, map, max, min]);

  useEffect(() => {
    const hasProps = !!latitude && !!longitude && latitudeDelta && longitudeDelta;
    if (hasMapLoaded && hasProps) {
      const coordinate = new Coordinate(latitude, longitude);
      const _span = new CoordinateSpan(latitudeDelta, longitudeDelta);
      const region = new CoordinateRegion(coordinate, _span);
      map.setCameraBoundaryAnimated(region, animate);
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

  useEffect(() => {
    if (hasMapLoaded && !!altitude) {
      map.setCameraDistanceAnimated(altitude, animate);
    }
  }, [CameraZoomRange, altitude, animate, hasMapLoaded, map]);

  return null;
}

export default useCamera;
