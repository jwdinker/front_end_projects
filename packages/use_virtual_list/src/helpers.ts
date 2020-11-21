export function areEqual(previous: any, current: any) {
  return previous.style === current.style && previous.index === current.index;
}
