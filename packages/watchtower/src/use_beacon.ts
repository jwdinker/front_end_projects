import { useEffect, useMemo } from 'react';
import useOffsets, { ElementOrReference } from '@jwdinker/use-offsets';
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
  element: ElementOrReference,
  { dynamicOffsets = true }: UseBeaconOptions = {}
): UseBeaconReturn {
  const [offsets, { measure }] = useOffsets(element, 'absolute');
  const [{ container, scroll }, changed] = useWatchTowerContext();

  useEffect(() => {
    if (changed) {
      measure();
    }
  }, [changed, measure]);

  const value = useMemo((): UseBeaconReturn => {
    if (dynamicOffsets) {
      const { height, width } = offsets;
      const top = offsets.top - scroll.y;
      const left = offsets.left - scroll.x;
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
