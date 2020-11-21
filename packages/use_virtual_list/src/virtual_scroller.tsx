import React, { CSSProperties } from 'react';
import { VirtualScrollerProps } from './types';

const CONTAINER_STYLE: CSSProperties = {
  position: 'relative',
  height: '100%',
  width: '100%',
};

const VirtualScroller = React.forwardRef<HTMLDivElement, VirtualScrollerProps>(
  (props: VirtualScrollerProps, ref) => {
    const { items, scrollerStyle, spacerStyle } = props;

    return (
      <div style={CONTAINER_STYLE}>
        <div ref={ref} style={scrollerStyle}>
          {items}
          <div style={spacerStyle} />
        </div>
      </div>
    );
  }
);

export default VirtualScroller;
