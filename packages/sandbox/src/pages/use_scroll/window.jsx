import * as React from 'react';
import { useScroll } from '@jwdinker/use-scroll';
import { withCoreProviders } from '../../hocs';

const Contents = () => {
  const _window = typeof window !== 'undefined' ? window : null;
  const [scroll, scrollTo] = useScroll(_window);

  console.log('scroll: ', scroll);

  return <div style={{ height: '10000px', width: '100%' }} />;
};

export default withCoreProviders(Contents);
