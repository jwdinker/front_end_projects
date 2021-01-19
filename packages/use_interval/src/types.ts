/**
 * Starts the interval loop.
 */
export type StartInterval = () => void;

/**
 * Stops the interval loop.
 */
export type StopInterval = () => void;

export type UseIntervalReturn = [StartInterval, StopInterval];

export type OnWait = (elapsed: number, time: number, stop: StopInterval) => void;
export type OnInterval = (time: number, stop: StopInterval) => void;

export interface UseIntervalProps {
  interval?: number;
  onWait: OnWait;
  onInterval: OnInterval;
}
