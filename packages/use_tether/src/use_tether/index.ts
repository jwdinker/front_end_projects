import useScrollCoordinates, { ScrollElement } from '@jwdinker/use-scroll-coordinates';
import useAncestorScrollListener from '@jwdinker/use-ancestors-scroll-listener';

import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';
import useOffsetsList, { ElementOrReference } from '@jwdinker/use-offsets-list';
import { Alignment, Anchor, AbbreviatedRectangle } from '../types';

import { coordinateFromPosition } from './helpers';
import { ALIGNMENTS_TYPES, ALIGNMENTS_KEYS } from '../constants';
import useAnchor from '../use_anchor';

function useTether(
  anchor: ElementOrReference,
  elements: ElementOrReference[],
  alignment: Alignment = ALIGNMENTS_TYPES.bottom
) {
  const anchorMeasurements = useAnchor(anchor, elements);
  const [offsetsOfElements, remeasure] = useOffsetsList(elements);

  const [x, y] = ALIGNMENTS_KEYS[alignment];

  const tetheredMeasurements: AbbreviatedRectangle[] = [];
  for (let index = 0; index < offsetsOfElements.length; index += 1) {
    const offsets = offsetsOfElements[index];
    const coordinates = index === 0 ? anchorMeasurements : tetheredMeasurements[index - 1];
    const top = coordinateFromPosition[y](coordinates, offsets);
    const left = coordinateFromPosition[x](coordinates, offsets);

    const { height, width } = offsets;
    tetheredMeasurements.push({
      top,
      left,
      height,
      width,
    });
  }

  return [tetheredMeasurements, anchorMeasurements, remeasure];
}

export default useTether;
