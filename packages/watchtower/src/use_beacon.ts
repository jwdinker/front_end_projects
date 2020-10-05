import { useEffect, useMemo } from 'react';
import useOffsets, { UseOffsetsElement } from '@jwdinker/use-offsets';
import useWatchTowerContext from './use_watch_tower_context';
import { UseBeaconOptions, UseBeaconReturn } from './types';

/*
useBeacon
-------------
The roles of useBeacon are:
  1. Calculating the position of an element using the provider's scroll.
  2. Listen for changes in the scrollable area and update offsets accordingly.
*/

function useBeacon(
  element: UseOffsetsElement,
  { dynamicOffsets = true }: UseBeaconOptions = {}
): UseBeaconReturn {
  const [offsets, remeasure] = useOffsets(element);
  const [{ container, scroll }, changed] = useWatchTowerContext();

  useEffect(() => {
    if (changed) {
      remeasure();
    }
  }, [changed, element, remeasure]);

  const value = useMemo((): UseBeaconReturn => {
    if (dynamicOffsets) {
      const { height, width } = offsets;
      const top = offsets.top - scroll.x;
      const left = offsets.left - scroll.y;
      return [
        {
          element: {
            top,
            left,
            right: left + width,
            bottom: top + height,
            height,
            width,
          },
          scroll,
          container,
        },
        changed,
      ];
    }
    return [{ element: offsets, scroll, container }, changed];
  }, [changed, container, dynamicOffsets, offsets, scroll]);

  return value;
}

export default useBeacon;
