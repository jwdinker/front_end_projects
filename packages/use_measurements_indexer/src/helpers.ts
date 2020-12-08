export const LOG_INFO = [
  ['▲', 'background:#3fd760;color:black;'],
  ['▼', 'background:#ffcc00;color:black;'],
];

export function print(direction = 1, index = 0, size = 0, offset = 0) {
  const [symbol, color] = LOG_INFO[direction];
  console.log(`%c${symbol}`, color, `\tIndex:${index}\n\tSize:${size}\n\tOffset:${offset}\n\n`);
}
