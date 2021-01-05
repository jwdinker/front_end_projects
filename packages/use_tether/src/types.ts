export type Alignment = 'top' | 'bottom' | 'left' | 'right';

export type Side = 'top' | 'bottom' | 'left' | 'right';

export type AllowOverflow = Side[];

export interface Measurements {
  top: number;
  left: number;
  height: number;
  width: number;
}

export interface MeasurementsWithRotation extends Measurements {
  rotate: number;
}

export interface Dimensions {
  height: number;
  width: number;
}

export interface TetheredTransform extends Measurements {
  rotate?: number | undefined;
}

export type CoordinateFromPositionFn = (
  coordinates: Measurements,
  dimensions: Dimensions
) => number;

export interface CoordinateFromPosition {
  top: CoordinateFromPositionFn;
  centerX: CoordinateFromPositionFn;
  centerY: CoordinateFromPositionFn;
  bottom: CoordinateFromPositionFn;
  left: CoordinateFromPositionFn;
  right: CoordinateFromPositionFn;
}

export type TetheredPosition = 'absolute' | 'fixed';

export type UpdateAnchorPosition = () => void;

export type UseAnchorReturn = [Measurements, UpdateAnchorPosition];

export type UpdateSizeAndPosition = () => void;

export type UseTetherReturn = [Measurements[], Measurements, UpdateSizeAndPosition];

export type AnchorElement = React.RefObject<HTMLElement | undefined | null>;
export type TetheredElement = React.RefObject<HTMLElement | undefined | null>;

export type TetherableMeasurements = Measurements[];

export type UseTether = (
  anchor: AnchorElement,
  tetherables: TetheredElement[],
  alignment: Alignment
) => [TetherableMeasurements, Measurements, UpdateAnchorPosition];

export type UseAnchor = (
  anchor: AnchorElement,
  tetherables: TetheredElement[]
) => [Measurements, UpdateAnchorPosition];

export type At = {
  [K in Side]?: Alignment[];
};

export interface FlippableOptions {
  anchor: Measurements;
  tetherables: Measurements[];
  boundaries: Measurements;
  at?: At;
  preference?: Alignment;
}

export type Flippable = (options: FlippableOptions) => Alignment;

export type ArrowableReturn = [MeasurementsWithRotation, ...Array<Measurements>];

export type Arrowable = (tetherables: Measurements[], anchor: Measurements) => ArrowableReturn;

export type PreventableOverflowReturn = Measurements[];

export type PreventOverflowBehavior = 'stack' | 'collapse';

export interface PreventableOverflowOptions {
  anchor: Measurements;
  tetherables: TetherableMeasurements;
  boundaries: Measurements;
  allow?: AllowOverflow;
  behavior?: PreventOverflowBehavior;
}

export type PreventableOverflowWithArrowReturn = [MeasurementsWithRotation, ...Array<Measurements>];

export interface PreventableOverflowWithArrowOptions {
  anchor: Measurements;
  tetherables: TetherableMeasurements;
  boundaries: Measurements;
  allow?: Alignment[];
}

export interface ModifyProps {
  tetherables: TetherableMeasurements;
  anchor: Measurements;
  boundaries: Measurements;
  overflow?: AllowOverflow;
  at?: At;
  hasArrow?: boolean;
  preference?: Alignment;
  behavior?: PreventOverflowBehavior;
}

export type ModifyReturn =
  | [TetherableMeasurements, Alignment]
  | [MeasurementsWithRotation, Alignment];
