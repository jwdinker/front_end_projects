import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
  Component,
  memo,
  useLayoutEffect,
} from 'react';
import {
  Box,
  Row,
  Text,
  Centered,
  Fixed,
  Absolute,
  Relative,
  Flex,
  Button,
  Ratio,
} from '@jwdinker/styled-system';

import { useWeeks, useViewingDate, format } from '@jwdinker/use-schedule';

import { useVirtualScroll } from '@jwdinker/use-virtual-scroll';

import useSize from '@jwdinker/use-size';
import { unstable_batchedUpdates as batch } from 'react-dom';

import { withCoreProviders } from '../../hocs';

const Indexes = ({ key, index, data, style, isScrolling }) => {
  return useMemo(() => {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          background: index % 2 ? 'white' : '#EFEFEF',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
        }}>
        {`ROW ${index}`}
      </div>
    );
  }, [index, style]);
};

const MemoizedIndexes = memo(Indexes, (previous, current) => {
  return previous.key === current.key && previous.style.height === current.style.height;
});

const PAGE_STYLE = {
  height: '100vh',
  width: '100%',
  maxHeight: '100%',
};
function Contents() {
  const element = useRef();
  const [{ height, width }, hasChangedSize] = useSize(element);

  // const viewing = useViewingDate();
  // const [dates, range] = useWeeks(viewing.date, 0, 100);

  // const data = useMemo(
  //   () => ({
  //     weeks: dates,
  //     adjustment: i,
  //   }),
  //   [dates, i]
  // );

  const args = {
    component: MemoizedIndexes,
    height,
    width: '100%',
    estimatedSize: height ? height / 7 : 50,
    runway: 3,
    itemSize: height / 10,
    numberOfItems: 1000,
  };

  const { reference, items, styles, indexes, scrollToIndex, reset } = useVirtualScroll(args);

  const goTo = useCallback(() => {
    scrollToIndex(200);
  }, [scrollToIndex]);

  return useMemo(
    () => (
      <>
        <div ref={element} style={PAGE_STYLE}>
          <div ref={reference} style={{ ...styles.container, pointerEvents: 'none' }}>
            <div style={styles.contents}>{items}</div>
          </div>
        </div>
        <Absolute top={0} right={0}>
          <Button onClick={goTo}>Go To 200</Button>
        </Absolute>
      </>
    ),
    [goTo, items, reference, styles.container, styles.contents]
  );
}

export default withCoreProviders(Contents);
