import React, { useMemo, forwardRef } from 'react';
import Context from './context';
import useScrollState from './use_scroll_state';

const ScrollBroadcast = forwardRef(({ children, endDelay, passive }, element) => {
  const options = useMemo(
    () => ({
      endDelay,
      passive,
    }),
    [endDelay, passive]
  );
  const value = useScrollState(element, options);
  return <Context.Provider value={value}>{children}</Context.Provider>;
});

ScrollBroadcast.defaultProps = {
  passive: false,
  endDelay: 200,
};

export default ScrollBroadcast;
