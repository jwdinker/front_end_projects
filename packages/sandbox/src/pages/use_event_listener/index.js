import * as React from 'react';

import useEventListener from '@jwdinker/use-event-listener';
import { withCoreProviders } from '../../hocs';

const { useEffect } = React;

function Component() {
  const _window = typeof window !== 'undefined' ? window : null;
  const listener = useEventListener(
    _window,
    'scroll touchstart touchmove touchend',
    () => {
      console.log('scroll');
      // do stuff
    },
    {
      consolidate: true,
    }
  );

  useEffect(() => {
    listener.attach();

    return listener.detach;
  }, [listener]);

  return <div style={{ height: '400vh', width: '100%' }} />;
}

export default withCoreProviders(Component);
