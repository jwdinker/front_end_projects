import React, { useEffect, useRef } from 'react';

import useVirtualList, { areEqual } from '@jwdinker/use-virtual-list';
import useSize from '@jwdinker/use-size';
import getRandomNumberInRange from '@jwdinker/get-random-number-in-range';
import styled from 'styled-components';

import { useSpring, animated } from 'react-spring';

import useSwipe, { CONTAINER_STYLE, TRANSLATOR_BASE_STYLE } from '@jwdinker/use-swipe';
import { withCoreProviders } from '../../../hocs';

const ITEM_STYLE = {
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '30px',
  fontWeight: 'bold',
  border: 'solid 1px black',
};

const NUMBER_OF_ITEMS = -1;

const MyComponent = (props) => {
  const { style, index } = props;

  return (
    <div style={style}>
      <div style={ITEM_STYLE}>{index}</div>
    </div>
  );
};

const MemoizedComponent = React.memo(MyComponent, areEqual);

const setItemSize = () => {
  return getRandomNumberInRange(30, 60);
};

function VirtualList() {
  const wrapperRef = useRef();
  const swiperRef = useRef();

  const [sizing] = useSize(swiperRef);

  const containerSize = sizing.height;

  const [
    {
      xy: [x, y],
      move: [mx, my],
      direction: [dx, dy],
      phase,
    },
    snapTo,
  ] = useSwipe(swiperRef, {
    wheel: true,
    // canSwipe: ({ xy }) => xy[1] >= 0,
  });

  const options = {
    component: MemoizedComponent,
    itemSize: 40,
    axis: 'y',
    offset: y,
    direction: dy,
    responsive: true,
    numberOfItems: NUMBER_OF_ITEMS,
    estimatedItemSize: 20,
    containerSize,
    bufferSize: 5,
    bufferByDirection: false,
  };

  const virtualList = useVirtualList(options);

  const { items, styles, indexes, getMeasurementsAtIndex, convertedOffset } = virtualList;

  const [animation, set] = useSpring(() => {
    return {
      ...TRANSLATOR_BASE_STYLE,
      transform: `translate3d(0,0%,0)`,
    };
  });

  const visibleStartIndex = indexes.visible[0];

  // snap to closest
  if (phase === 'end') {
    const { offset, size } = getMeasurementsAtIndex(visibleStartIndex);
    const halfSize = size / 2;

    const isForwards = convertedOffset >= offset + halfSize && convertedOffset < offset + size;
    const isBackwards = convertedOffset !== offset;

    if (isForwards) {
      snapTo({ y: getMeasurementsAtIndex(visibleStartIndex + 1, 'px').offset });
    } else if (isBackwards) {
      snapTo({ y: getMeasurementsAtIndex(visibleStartIndex, 'px').offset });
    }
  }

  useEffect(() => {
    set(() => ({
      position: 'absolute',
      height: '100%',
      width: '100%',
      transform: `translate3d(0,${convertedOffset * -1}%,0)`,
    }));
  }, [set, convertedOffset]);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div ref={swiperRef} style={CONTAINER_STYLE}>
        <animated.div style={animation}>{items}</animated.div>
      </div>
    </div>
  );
}

const Page = withCoreProviders(VirtualList);

export default Page;
