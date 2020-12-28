/**
 * Starts the animation frame loop.
 */
export type StartFrameLoop = () => void;

/**
 * Starts the animation frame loop.
 */
export type StopFrameLoop = () => void;

export type UseAnimationFrameReturn = [StartFrameLoop, StopFrameLoop];
