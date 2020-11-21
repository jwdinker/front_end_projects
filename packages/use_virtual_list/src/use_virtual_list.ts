import * as React from 'react';
import useMeasurementsIndexer, { OnMeasure } from '@jwdinker/use-measurements-indexer';
import useScrollCoordinates from '@jwdinker/use-scroll-coordinates';
import useSize from '@jwdinker/use-size';
import upTo from '@jwdinker/up-to';
import { VirtualListProps } from './types';

import { CONFIGURATIONS } from './constants';

const { useRef, useEffect, useMemo, createElement, useCallback } = React;

function useVirtualList(props: VirtualListProps) {
  const {
    component,
    runway = 3,
    responsive = false,
    layout = 'vertical',
    itemSize,
    numberOfItems,
    onMeasure = () => {},
    estimatedItemSize,
  } = props;

  const container = useRef<HTMLElement>();
  const scroller = useRef<HTMLElement | HTMLDivElement>();

  const configuration = CONFIGURATIONS[layout];
  const { typeOf } = configuration;
  const unit = responsive ? '%' : 'px';

  useEffect(() => {
    if (scroller.current) {
      const { parentNode } = scroller.current;
      if (parentNode instanceof HTMLElement) {
        container.current = parentNode;
      }
    }
  }, [container]);

  const scroll = useScrollCoordinates(scroller);
  const [containerDimensions, hasContainerSizeChanged] = useSize(container);

  const containerSize = containerDimensions[typeOf.dimension];

  const overrun = responsive ? 100 : containerSize;

  const scrollOffset = responsive
    ? (scroll[typeOf.scroll] / containerSize) * 100
    : scroll[typeOf.scroll];

  const cachedProps = useRef({});

  const saveProps: OnMeasure = (index, itemMeasurements) => {
    const { size, offset } = itemMeasurements;
    onMeasure(index, itemMeasurements);

    cachedProps.current[index] = {
      key: index,
      index,
      style: {
        position: 'absolute',
        [typeOf.dimension]: `${size}${unit}`,
        [typeOf.oppositeDimension]: '100%',
        [typeOf.offset]: `${offset}${unit}`,
      },
    };
  };

  const measurementIndexer = useMeasurementsIndexer({
    numberOfItems,
    itemSize,
    onMeasure: saveProps,
    estimatedItemSize,
    log: false,
  });

  const {
    getMeasurements,
    getIndexByOffset,
    getIndexRangeFromOffsets,
    clearMeasurements,
    getTotalSize,
  } = measurementIndexer;

  const _getMeasurements = useRef(getMeasurements);
  _getMeasurements.current = getMeasurements;

  const canRender = containerSize > 0;

  const indexesInOffsetRange = canRender
    ? getIndexRangeFromOffsets(Math.max(0, scrollOffset), scrollOffset + 200)
    : [0, 0];

  const startIndex = Math.max(indexesInOffsetRange[0], 0);
  const endIndex = Math.min(indexesInOffsetRange[1], numberOfItems - 1);

  const items = useMemo((): React.Component[] => {
    if (!canRender) {
      return [];
    }
    return upTo<React.Component>(startIndex, endIndex, (index: number) => {
      const elementProps = cachedProps.current[index];
      if (!elementProps) {
        _getMeasurements.current(index);
      }
      const element = createElement(component, cachedProps.current[index]);
      return element;
    });
  }, [canRender, component, endIndex, startIndex]);

  const totalSize = canRender ? getTotalSize() : 0;

  const scrollerStyle = useMemo(
    (): React.CSSProperties => ({
      position: 'relative',
      [typeOf.dimension]: `${containerSize}px`,
      [typeOf.max]: `${containerSize}px`,
      [typeOf.oppositeDimension]: '100%',
      overflow: 'scroll',
      willChange: 'transform',
      WebkitOverflowScrolling: 'touch',
      boxSizing: 'border-box',
      transform: 'translate3d(0,0,0)',
    }),
    [containerSize, typeOf.dimension, typeOf.max, typeOf.oppositeDimension]
  );

  const spacerStyle = useMemo(
    (): React.CSSProperties => ({
      position: 'absolute',
      top: 0,
      left: 0,
      [typeOf.min]: `${totalSize}${unit}`,
      [typeOf.oppositeDimension]: `100%`,
      boxSizing: 'border-box',
    }),
    [totalSize, typeOf.min, typeOf.oppositeDimension, unit]
  );

  const scrollTo = useCallback(
    (index: number) => {
      if (scroller.current) {
        const { offset } = _getMeasurements.current(index);
        console.log('OFFSET: ', offset);
        const coordinate = responsive ? (offset / 100) * containerSize : offset;
        scroller.current.scrollTo(0, coordinate);
      }
    },
    [responsive, containerSize]
  );

  const virtualScrollerProps = {
    items,
    ref: scroller,
    scrollerStyle,
    spacerStyle,
  };

  return [virtualScrollerProps, { scrollTo }];
}

export default useVirtualList;
