export const PHASES = {
  IDLE: 'idle',
  START: 'start',
  MOVE: 'move',
  END: 'end',
} as const;

export const CONTAINER_STYLE: React.CSSProperties = {
  position: 'relative',
  height: '100%',
  width: '100%',
  maxHeight: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  overflow: 'hidden',
};

export const TRANSLATOR_BASE_STYLE: React.CSSProperties = {
  position: 'absolute',
  height: '100%',
  width: '100%',
};
