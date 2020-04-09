type Phase = 'start' | 'move' | 'end';

const START = 'start';
const MOVE = 'move';
const END = 'end';
const UNKNOWN = 'unknown';

export const PHASES = {
  START,
  MOVE,
  END,
};

export const START_EVENT_TYPES = ['mousedown', 'touchstart'];
export const MOVE_EVENT_TYPES = ['mousemove', 'touchmove'];
export const END_EVENT_TYPES = ['mouseup', 'mouseleave', 'touchend', 'touchcancel'];

const EVENT_TYPES_TO_PHASE = {
  mousedown: 'start',
  mousemove: 'move',
  mouseup: 'end',
  mouseleave: 'end',
  touchstart: 'start',
  touchmove: 'move',
  touchend: 'end',
  touchcancel: 'end',
};

export function getPhase(eventType: string): Phase {
  return EVENT_TYPES_TO_PHASE[eventType] || UNKNOWN;
}

function checkCondtions<T>(args: T[]): boolean {
  let result = true;

  if (args.length === 1) return result;

  for (let index = 1; index <= args.length; index += 1) {
    const arg = args[index];

    if (typeof arg === 'function') {
      const value = arg();
      result = value;
      if (!result) {
        break;
      }
    }
    if (typeof arg === 'boolean') {
      result = arg;
      if (!result) {
        break;
      }
    }
  }
  return result;
}

function getEventType<T>(args: T[]): string {
  const eventType = args[0];
  if (typeof eventType !== 'string') {
    throw new Error('The first arguement to a created phase helper must be a string');
  }
  return eventType;
}

export function isStart<T>(...args: T[]): boolean {
  const eventType = getEventType(args);
  return getPhase(eventType) === START && checkCondtions(args);
}

export function isMove<T>(...args: T[]): boolean {
  const eventType = getEventType(args);
  return getPhase(eventType) === MOVE && checkCondtions(args);
}

export function isEnd<T>(...args: T[]): boolean {
  const eventType = getEventType(args);
  return getPhase(eventType) === END && checkCondtions(args);
}

export function makeIsPhase(eventTypes: string[]) {
  return <T>(...args: T[]): boolean => {
    const eventType = getEventType(args);
    const isSamePhase = eventTypes.some((type) => eventType === type);

    return isSamePhase && checkCondtions(args);
  };
}
