import useEventListener from '@jwdinker/use-event-listener';
import { useRef, useCallback, useMemo, useState } from 'react';
import useInteractivity from '@jwdinker/use-interactivity';
import { getEventNames, is, getPageCoordinates } from './helpers';

function useDrag(
  element,
  { mouse = true, touch = true, passive = false, capture = false, once = false } = {}
) {
  const event = useRef();
  const [isDragging, setDragging] = useState(false);
  const [state, handlers] = useInteractivity();

  const [targetEvents, boundaryEvents] = useMemo(() => getEventNames(mouse, touch), [mouse, touch]);

  const handler = useCallback(
    (_event) => {
      event.current = _event;
      const { type } = _event;
      const page = getPageCoordinates(_event);

      if (is.start(type)) {
        setDragging(true);
        return handlers.start(...page);
      }

      if (is.move(type) && isDragging) {
        return handlers.move(...page);
      }

      if (is.end(type)) {
        setDragging(false);
        return handlers.end(...page);
      }
    },
    [handlers, isDragging]
  );

  useEventListener(
    useMemo(
      () => ({
        target: element,
        type: targetEvents,
        handler,
        passive,
        once,
        capture,
        consolidate: true,
      }),
      [capture, element, handler, once, passive, targetEvents]
    )
  );

  useEventListener(
    useMemo(
      () => ({
        target: typeof window !== 'undefined' ? document : null,
        type: boundaryEvents,
        handler,
        passive,
        once,
        capture,
        consolidate: true,
      }),
      [boundaryEvents, capture, handler, once, passive]
    )
  );

  return [state, event.current];
}

export default useDrag;
