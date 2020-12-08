/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import useInstance from '@jwdinker/use-instance';
import MeasurementsIndexer from './measurements_indexer';

import { MeasurementsIndexerProps } from './types';

export { MeasurementsIndexerProps, Measurements, IndexRange, OnMeasure } from './types';

const { useEffect } = React;

const initialize = (props: MeasurementsIndexerProps) => new MeasurementsIndexer(props);

function useMeasurementsIndexer(props: MeasurementsIndexerProps) {
  const {
    itemSize = 100,
    estimatedItemSize = 100,
    numberOfItems = -1,
    log = false,
    onMeasure = () => {},
    onClear = () => {},
    onReset = () => {},
  } = props;

  const _props = {
    itemSize,
    estimatedItemSize,
    numberOfItems,
    log,
    onMeasure,
    onClear,
    onReset,
  };

  const measurementsIndexer = useInstance(initialize(_props));

  /*
  Since a vanilla es6 class is used, measurement indexer must account for side
  effects.  
  */
  useEffect(() => {
    measurementsIndexer.updateProps(_props);
  });

  useEffect(() => {
    return measurementsIndexer.clear;
  }, []);

  return measurementsIndexer;
}

export default useMeasurementsIndexer;
