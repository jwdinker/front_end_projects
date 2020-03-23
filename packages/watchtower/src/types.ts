import { RefObject } from 'react';
import { ScrollState } from '@jwdinker/use-scroll';

export interface WatchTowerProps {
  children?: React.ReactNode;
  interval?: number;
  scrollable?: RefObject<HTMLElement | Window | null | undefined> | null | Window;
}

export type Target = HTMLElement | undefined | null;

export type Rectangle = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
};

export interface WatchTowerContainer {
  container: Rectangle;
  scroll: ScrollState;
}

/**
 * Boolean indicating that the scroll dimensions or window size or the scrollable container has changed.
 */
export type Changed = boolean;

export type WatchTowerContext = [WatchTowerContainer, Changed];

export interface UseBeaconOptions {
  dynamicOffsets?: boolean;
}

export interface BeaconDetails {
  element: Rectangle;
  scroll: ScrollState;
  container: Rectangle;
}

export type UseBeaconReturn = [BeaconDetails, Changed];
