import useScrollCoordinates, { ScrollElement } from '@jwdinker/use-scroll-coordinates';
import useAncestorScrollListener from '@jwdinker/use-ancestors-scroll-listener';

import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';
import useOffsetsList, { ElementOrReference } from '@jwdinker/use-offsets-list';
import { Alignment, Anchor, AbbreviatedRectangle } from '../types';

import { coordinateFromPosition } from './helpers';
import { DEFAULT_ANCHOR_MEASUEMENTS, ALIGNMENTS_TYPES, ALIGNMENTS_KEYS } from '../constants';

function useTether(
  anchor: Anchor = DEFAULT_ANCHOR_MEASUEMENTS,
  elements: ElementOrReference[],
  alignment: Alignment = ALIGNMENTS_TYPES.bottom
) {
  const anchorReference = anchor && 'current' in anchor ? anchor : null;

  const [anchorPosition, { update: updateAnchor }] = useBoundingClientRect(anchorReference);
  const [offsetsOfElements, remeasure] = useOffsetsList(elements);

  const update = () => {
    updateAnchor();
  };

  const references = [anchorReference, ...elements];
  useAncestorScrollListener(references, update);

  const anchorMeasurements = anchorReference ? anchorPosition : (anchor as AbbreviatedRectangle);

  const [x, y] = ALIGNMENTS_KEYS[alignment];

  const tetherables: AbbreviatedRectangle[] = [];
  for (let index = 0; index < offsetsOfElements.length; index += 1) {
    const offsets = offsetsOfElements[index];
    const coordinates = index === 0 ? anchorMeasurements : tetherables[index - 1];
    const top = coordinateFromPosition[y](coordinates, offsets);
    const left = coordinateFromPosition[x](coordinates, offsets);

    tetherables.push({
      ...offsets,
      top,
      left,
    });
  }

  return [tetherables, anchorMeasurements];
}

export default useTether;
