// Pulled from https://gist.github.com/gre/1650294

const easeIn = (power: number) => {
  return (time: number) => {
    return Math.pow(time, power);
  };
};

const easeOut = (power: number) => {
  return (time: number) => {
    return 1 - Math.abs(Math.pow(time - 1, power));
  };
};

const easeInOut = (power: number) => {
  return (time: number) => {
    return time < 0.5 ? easeIn(power)(time * 2) / 2 : easeOut(power)(time * 2 - 1) / 2 + 0.5;
  };
};

const easeInElastic = (time: number) => (0.04 - 0.04 / time) * Math.sin(25 * time) + 1;

const easeOutElastic = (time: number) => {
  const power = 4;
  return Math.pow(2, -10 * time) * Math.sin(((time - power / 4) * (2 * Math.PI)) / power) + 1;
};

const easeInOutElastic = (time: number) =>
  (time -= 0.5) < 0
    ? (0.02 + 0.01 / time) * Math.sin(50 * time)
    : (0.02 - 0.01 / time) * Math.sin(50 * time) + 1;

const fns = {
  linear: easeInOut(1),
  easeInQuad: easeIn(2),
  easeOutQuad: easeInOut(2),
  easeInOutQuad: easeInOut(2),
  easeInCubic: easeIn(3),
  easeOutCubic: easeOut(3),
  easeInOutCubic: easeInOut(3),
  easeInQuart: easeIn(4),
  easeOutQuart: easeOut(4),
  easeInOutQuart: easeInOut(4),
  easeInQuint: easeIn(5),
  easeOutQuint: easeInOut(5),
  easeInOutQuint: easeInOut(5),
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
} as const;

export const EASING_TYPES = {
  LINEAR: 'linear',
  EASE_IN_QUAD: 'easeInQuad',
  EASE_OUT_QUAD: 'easeOutQuad',
  EASE_IN_OUT_QUAD: 'easeInOutQuad',
  EASE_IN_CUBIC: 'easeInCubic',
  EASE_OUT_CUBIC: 'easeOutCubic',
  EASE_IN_OUT_CUBIC: 'easeInOutCubic',
  EASE_IN_QUART: 'easeInQuart',
  EASE_OUT_QUART: 'easeOutQuart',
  EASE_IN_OUT_QUART: 'easeInOutQuart',
  EASE_IN_QUINT: 'easeInQuint',
  EASE_OUT_QUINT: 'easeOutQuint',
  EASE_IN_OUT_QUINT: 'easeInOutQuint',
  EASE_IN_ELASTIC: 'easeInElastic',
  EASE_OUT_ELASTIC: 'easeOutElastic',
  EASE_IN_OUT_ELASTIC: 'easeInOutElastic',
} as const;

export type EasingType = typeof EASING_TYPES[keyof typeof EASING_TYPES];

export default fns;
