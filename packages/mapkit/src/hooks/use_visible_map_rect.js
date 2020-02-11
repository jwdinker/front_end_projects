import { useContext, useRef, useEffect, useMemo } from 'react';
import { MapContext } from '../contexts';

function useVisibleMapRect({ x = null, y = null, height = null, animate = false } = {}) {
  const { index, hasMapLoaded } = useContext(MapContext);
  const { Coordinate, CoordinateSpan, CoordinateRegion, Padding, MapRect, CameraZoomRange } = mapkit;

  const map = useMemo(() => {
    if (hasMapLoaded) {
      return mapkit.maps[index];
    }
    return null;
  }, [hasMapLoaded, index]);

  useEffect(() => {
    const hasProps = !!height && !!width && !!x && !!y;
    if (hasMapLoaded && hasProps) {
      const mapRect = new MapRect(x, y, height, width);
      map.setVisibleMapRectAnimated(mapRect, animate);
    }
  }, [CameraZoomRange, MapRect, animate, hasMapLoaded, height, map, x, y]);

  return map ? map.visibleMapRect : null;
}

export default useCamera;
