import { useRef, useEffect } from 'react';
import useEventListener from '@jwdinker/use-event-listener';

function useAnnotationAndOverlayEvents(
  item,
  { onSelect = () => {}, onDeselect = () => {}, onDragStart = () => {}, onDrag = () => {}, onDragEnd = () => {} } = {}
) {
  const handlers = useRef();

  useEffect(() => {
    handlers.current = {
      select: onSelect,
      deselect: onDeselect,
      'drag-start': onDragStart,
      dragging: onDrag,
      'drag-end': onDragEnd,
    };
  });

  useEventListener({
    target: item,
    type: 'select deselect drag-start dragging drag-end',
    handler: (event) => {
      const { type } = event;
      handlers.current[type](event);
    },
  });

  return null;
}

export default useAnnotationAndOverlayEvents;
