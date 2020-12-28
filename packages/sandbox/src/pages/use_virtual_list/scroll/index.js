import React, { useRef } from 'react';

import useVirtualList, { areEqual } from '@jwdinker/use-virtual-list';
import useSize from '@jwdinker/use-size';
import getRandomNumberInRange from '@jwdinker/get-random-number-in-range';

import { useScroll } from '@jwdinker/use-scroll';
import { withCoreProviders } from '../../../hocs';

const FULL_HW_STYLE = {
  height: '100%',
  width: '100%',
};

const FILL_VIEWPORT_STYLE = {
  height: '100vh',
  width: '100%',
};

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
  return getRandomNumberInRange(10, 60);
};

function VirtualList() {
  const wrapperRef = useRef();
  const [sizing] = useSize(wrapperRef);
  const containerSize = sizing.height;

  const scrollerRef = useRef();
  const [scroll] = useScroll(scrollerRef);

  const options = {
    component: MemoizedComponent,
    itemSize: setItemSize,
    axis: 'y',
    offset: scroll.y,
    direction: scroll.direction,
    responsive: true,
    numberOfItems: 10000,
    estimatedItemSize: 50,
    containerSize,
    hasActiveScroll: true,
    buffer: 3,
  };

  const virtualList = useVirtualList(options);

  const { items, styles } = virtualList;

  return (
    <div style={FILL_VIEWPORT_STYLE}>
      <div ref={wrapperRef} style={FULL_HW_STYLE}>
        <div ref={scrollerRef} style={styles.container}>
          {items}
          <div style={styles.spacer} />
        </div>
      </div>
    </div>
  );
}

const Page = withCoreProviders(VirtualList);

export default Page;
