import { UseMeasurementsIndexerProps } from '@jwdinker/use-measurements-indexer';
import { ScrollElement } from '@jwdinker/use-scroll-coordinates';
import {
  CSSProperties,
  StatelessComponent,
  ComponentClass,
  MutableRefObject,
  RefObject,
} from 'react';

export type LayoutType = 'vertical' | 'horizontal';

export interface VirtualListProps extends UseMeasurementsIndexerProps {
  component: ComponentClass;
  layout?: LayoutType;
  numberOfItems: number;
  runway?: number;
  responsive?: boolean;
}

export interface ContainerAndContentStyles {
  container: CSSProperties;
  contents: CSSProperties;
}

export interface VirtualScrollerProps {
  spacerStyle: CSSProperties;
  scrollerStyle: CSSProperties;
  items: React.Component[];
}

// export interface VirtualScrollerProps {
//   references: {
//     container: React.MutableRefObject<HTMLElement | undefined>;
//     scroller: React.MutableRefObject<HTMLElement | undefined>;
//   };
//   styles: {
//     spacer: CSSProperties;
//     scroller: CSSProperties;
//   };
//   items: React.Component[];
// }

// export interface VirtualScrollerProps {
//   references: {
//     container(instance: HTMLElement | null): void;
//     scroller(instance: HTMLElement | null): void;
//   };
//   styles: {
//     spacer: CSSProperties;
//     scroller: CSSProperties;
//   };
//   items: React.Component[];
// }
