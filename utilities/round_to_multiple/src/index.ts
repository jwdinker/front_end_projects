function roundToMultiple(multiple: number, digit: number): number {
  if (digit > 0) return Math.ceil(digit / multiple) * multiple;
  if (digit < 0) return Math.floor(digit / multiple) * multiple;
  return multiple;
}

export function makeRoundToMultiple(multiple: number) {
  return (digit: number): number => {
    return roundToMultiple(multiple, digit);
  };
}

export default roundToMultiple;
