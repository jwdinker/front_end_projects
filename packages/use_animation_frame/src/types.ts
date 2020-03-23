/**
 * Starts the animation frame loop.  Used in conjunction with toggable.
 */
type StartFrameLoop = () => void;

/**
 * Starts the animation frame loop.  Used in conjunction with toggable.
 */
type StopFrameLoop = () => void;

export type UseAnimationFrameReturn = [StartFrameLoop, StopFrameLoop];
