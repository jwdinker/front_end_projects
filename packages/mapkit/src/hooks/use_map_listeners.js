import useEventListener from '@jwdinker/use-event-listener';
import { useContext, useMemo, useEffect, useRef } from 'react';
import { MapContext } from '../contexts';
import { MAP_DISPLAY_EVENT_NAMES } from '../constants';

const eventNames = Object.values(MAP_DISPLAY_EVENT_NAMES).reduce(
  (accumulator, name, index, original) => {
    if (index === 0) return accumulator + name;
    return (accumulator += ` ${name}`);
  },
  ''
);

function useMapListeners({
  onRegionChangeStart = () => {},
  onRegionChangeEnd = () => {},
  onScrollStart = () => {},
  onScrollEnd = () => {},
  onZoomStart = () => {},
  onZoomEnd = () => {},
  onChange = () => {},
} = {}) {
  const { hasMapLoaded, index } = useContext(MapContext);

  const handlers = useRef();

  useEffect(() => {
    handlers.current = {
      change: onChange,
      'region-change-start': onRegionChangeStart,
      'region-change-end': onRegionChangeEnd,
      'scroll-start': onScrollStart,
      'scroll-end': onScrollEnd,
      'zoom-start': onZoomStart,
      'zoom-end': onZoomEnd,
    };
  });

  const map = useMemo(() => {
    if (hasMapLoaded) {
      return mapkit.maps[index];
    }
    return null;
  }, [hasMapLoaded, index]);

  const handler = (event) => {
    const { type } = event;

    handlers.current.change(event);
    handlers.current[type](event);
  };

  const toggle = useEventListener(map, eventNames, handler, { consolidate: true });

  useEffect(() => {
    toggle.attach();
    return toggle.detach;
  }, [toggle]);

  return toggle;
}

export default useMapListeners;
