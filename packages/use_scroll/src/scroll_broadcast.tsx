import React, { useMemo, forwardRef } from 'react';
import Context from './context';
import useScrollState from './use_scroll_state';
import { ScrollBroadcastProps } from './types';

const ScrollBroadcast = ({
  children,
  endDelay = 200,
  passive = false,
  element,
}: ScrollBroadcastProps) => {
  const options = useMemo(
    () => ({
      endDelay,
      passive,
    }),
    [endDelay, passive]
  );
  const value = useScrollState(element, options);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ScrollBroadcast;
