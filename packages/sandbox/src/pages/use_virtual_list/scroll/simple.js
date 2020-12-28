import React, { useRef } from 'react';

import useVirtualList, { areEqual } from '@jwdinker/use-virtual-list';

import { useScroll } from '@jwdinker/use-scroll';
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
  boxSizing: 'border-box',
};

const Item = (props) => {
  const { style, index } = props;

  return (
    <div style={style}>
      <div style={ITEM_STYLE}>{index}</div>
    </div>
  );
};

const MemoizedItem = React.memo(Item, areEqual);

function VirtualList() {
  const scrollerRef = useRef();
  const [scroll] = useScroll(scrollerRef);

  const options = {
    component: MemoizedItem,
    itemSize: 20,
    axis: 'y',
    offset: scroll.y,
    direction: scroll.direction,
    responsive: true,
    numberOfItems: 10000,
    estimatedItemSize: 20,
    containerSize: 500,
    buffer: 3,
  };

  const virtualList = useVirtualList(options);

  const { items, styles } = virtualList;

  return (
    <div style={{ border: 'solid 1px black', position: 'relative' }}>
      <div ref={scrollerRef} style={styles.container}>
        {items}
        <div style={styles.spacer} />
      </div>
    </div>
  );
}

const Page = withCoreProviders(VirtualList);

export default Page;
