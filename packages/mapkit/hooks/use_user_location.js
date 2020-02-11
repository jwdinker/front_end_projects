import { useContext, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { MapContext } from '../contexts';
import useEventListener from '@jwdinker/use-event-listener';
import { USER_LOCATION_EVENTS, USER_LOCATION_ERRORS } from '../constants';

const { USER_LOCATION_CHANGE, USER_LOCATION_ERROR } = USER_LOCATION_EVENTS;
const { PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT, MAPKIT_NOT_INITALIZED } = USER_LOCATION_ERRORS;

function useLocation({
  onLocationChange = () => {},
  onPermissionDenied = () => {},
  onPositionUnavailable = () => {},
  onTimeout = () => {},
  onMapkitNotInitialized = () => {},
  onError = () => {},
} = {}) {
  const [isTracking, setTracking] = useState(false);
  const [isShowing, setShowing] = useState(false);

  const { hasMapLoaded, index } = useContext(MapContext);

  const map = useMemo(() => {
    if (hasMapLoaded) {
      return mapkit.maps[index];
    }
    return null;
  }, [hasMapLoaded, index]);

  const handlers = useRef();

  useEffect(() => {
    handlers.current = {
      onLocationChange: onLocationChange,
      error: {
        '1': {
          callback: onPermissionDenied,
          name: PERMISSION_DENIED,
        },
        '2': {
          callback: onPositionUnavailable,
          name: POSITION_UNAVAILABLE,
        },
        '3': {
          callback: onTimeout,
          name: TIMEOUT,
        },
        '4': {
          callback: onMapkitNotInitialized,
          name: MAPKIT_NOT_INITALIZED,
        },
      },
    };
  });

  useEventListener({
    target: map,
    type: 'user-location-change user-location-error',
    handler: (event) => {
      console.log('EVENT: ', event);
      const { type, code } = event;

      const isError = type === USER_LOCATION_ERROR;

      if (isError) {
        const { callback, name } = handlers.current.error[code];

        callback(event);
        onError(event, name);

        if (code === 1) {
          setTracking(false);
          setShowing(false);
        }
      } else {
        handlers.current.onLocationChange(event);
      }
    },
    consolidate: true,
  });

  const show = useCallback(() => {
    if (map) {
      map.showsUserLocation = true;

      if (map.showsUserLocation && !isShowing) {
        setShowing(true);
      }
    }
  }, [isShowing, map]);

  const hide = useCallback(() => {
    if (map) {
      map.showsUserLocation = false;
      if (!map.showsUserLocation && isShowing) {
        setShowing(false);
      }
    }
  }, [isShowing, map]);

  const track = useCallback(() => {
    if (map) {
      map.tracksUserLocation = true;
      if (map.tracksUserLocation && !isTracking) {
        setTracking(true);
      }
    }
  }, [isTracking, map]);

  const untrack = useCallback(() => {
    if (map) {
      map.tracksUserLocation = false;
      if (!map.tracksUserLocation && isTracking) {
        setTracking(false);
      }
    }
  }, [isTracking, map]);

  return {
    show,
    hide,
    track,
    untrack,
    isShowing,
    isTracking,
  };
}

export default useLocation;
