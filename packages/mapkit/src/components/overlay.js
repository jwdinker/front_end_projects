import { useContext, useEffect } from 'react';
import { useInstance } from '../internal';
import useAnnotationAndOverlayEvents from '../hooks/use_annotation_and_overlay_events';
import { MapContext } from '../contexts';

function Overlay({
  type,
  coordinates,
  points,
  onSelect,
  onDeselect,
  onDragStart,
  onDrag,
  onDragEnd,
  fillColor,
  fillOpacity,
  fillRule,
  lineCap,
  lineDash,
  lineDashOffset,
  lineJoin,
  lineWidth,
  strokeColor,
  strokeOpacity,
  radius,
  ...props
}) {
  const { CircleOverlay, PolylineOverlay, PolygonOverlay, Coordinate, Style } = mapkit;

  const { hasMapLoaded, index } = useContext(MapContext);

  const map = useMemo(() => {
    if (hasMapLoaded) {
      return mapkit.maps[index];
    }
    return null;
  }, [hasMapLoaded, index]);

  const style = {
    fillColor,
    fillOpacity,
    fillRule,
    lineCap,
    lineDash,
    lineDashOffset,
    lineJoin,
    lineWidth,
    strokeColor,
    strokeOpacity,
  };

  const isCircle = type === 'circle';
  const isPolyline = type === 'polyline';

  const overlay = useInstance(() => {
    if (isCircle) {
      return new CircleOverlay(new Coordinate(...coordinates), radius);
    }

    const _points = points.map((point) => new Coordinate(...point));

    if (isPolyline) {
      return new PolylineOverlay(_points);
    }

    return new PolygonOverlay([_points]);
  });

  useAnnotationAndOverlayEvents(overlay, { onSelect, onDeselect, onDragStart, onDrag, onDragEnd });

  useEffect(() => {
    if (map) {
      map.addOverlay(overlay);
      return () => {
        map.removeOverlay(overlay);
      };
    }
  }, [map, overlay]);

  useEffect(() => {
    const _style = new Style(style);
    overlay.style = _style;
  }, [Style, overlay.style, style]);

  useEffect(() => {
    Object.keys(props).forEach((key) => {
      overlay[key] = props[key];
    });
  }, [overlay, props]);

  return null;
}

Overlay.defaultProps = {
  //  Events
  //-----------
  onSelect: () => {},
  onDeselect: () => {},
  data: {},
  enabled: true,
  selected: false,
  visible: true,
  draggable: true,
  //    STYLE
  //-----------
  //Fill
  fillColor: 'rgb(0, 122, 255)',
  fillOpacity: 0.1,
  fillRule: 'nonzero',
  //Line
  lineCap: 'round',
  lineDash: [],
  lineDashOffset: 0,
  lineJoin: 'round',
  lineWidth: 1,
  //Stroke
  strokeColor: 'rgb(0, 122, 255)',
  strokeOpacity: 1,
};

export default Overlay;
