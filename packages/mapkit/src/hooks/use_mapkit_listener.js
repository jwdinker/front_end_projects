import { useRef, useEffect } from 'react';
import useEventListener from '@jwdinker/use-event-listener';

function useMapkitListener({
  onInitialization = () => {},
  onRefresh = () => {},
  onTooManyRequest = () => {},
  onUnauthorized = () => {},
  onError = () => {},
  onConfigurationChange = () => {},
} = {}) {
  const handlers = useRef();

  useEffect(() => {
    handlers.current = {
      Initialized: onInitialization,
      Refreshed: onRefresh,
      Unauthorized: onUnauthorized,
      'Too Many Requests': onTooManyRequest,
      'configuration-change': onConfigurationChange,
      error: onError,
    };
  });

  useEventListener({
    target: mapkit,
    type: 'configuration-change error',
    consolidate: true,
    handler: (event) => {
      const { type, status } = event;
      handlers.current[status](event);
      handlers.current[type](event);
    },
  });
}

export default useMapkitListener;
