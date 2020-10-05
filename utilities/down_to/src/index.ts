function downTo<T>(start: number, end: number, callback: Function): T[] {
  let index = start;
  const result: T[] = [];
  while (index >= end) {
    result.push(callback(index, result));
    index -= 1;
  }
  return result;
}

export default downTo;
