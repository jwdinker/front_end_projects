import useWindowSize from '@jwdinker/use-window-size';
import useScroll from '@jwdinker/use-scroll';
import useSSR from '@jwdinker/use-ssr';
import { adjustForViewport } from '../helpers';

function useViewportBoundaries() {
  const { isBrowser } = useSSR();
  const [scroll] = useScroll(isBrowser ? window : null);
  const [windowDimensions] = useWindowSize();
  return adjustForViewport(windowDimensions, scroll);
}

export default useViewportBoundaries;
