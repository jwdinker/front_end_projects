import { useRef, useEffect, useMemo } from 'react';
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
  }, [
    onConfigurationChange,
    onError,
    onInitialization,
    onRefresh,
    onTooManyRequest,
    onUnauthorized,
  ]);

  const handler = (event) => {
    const { type, status } = event;
    handlers.current[status](event);
    handlers.current[type](event);
  };

  useEventListener(
    typeof window !== 'undefined' ? window.mapkit : null,
    'configuration-change error',
    handler,
    { consolidate: true }
  );
}

export default useMapkitListener;
