function upTo<T>(start: number, end: number, callback: Function): T[] {
  let index = start;
  const result: T[] = [];
  while (index <= end) {
    result.push(callback(index));
    index += 1;
  }
  return result;
}

export default upTo;
