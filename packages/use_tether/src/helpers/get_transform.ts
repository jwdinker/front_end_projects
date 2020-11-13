import { TetheredTransform } from '../types';

function getTranform(unformattedTransform: TetheredTransform) {
  const { left, top, rotate } = unformattedTransform;
  let transform = `translate3d(${left}px,${top}px,0px)`;

  if (typeof rotate !== 'undefined') {
    transform += ` rotate(${rotate}deg)`;
  }
  return transform;
}

export default getTranform;
