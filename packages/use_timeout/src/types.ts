export type UseTimeoutCallback = () => void;

export type StartTimeout = () => void;

export type ClearTimeout = () => void;

export type UseTimeoutReturn = [StartTimeout, ClearTimeout];
