const LETTERS = '0123456789ABCDEF';

function getRandomColor() {
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    const number = Math.floor(Math.random() * 16);
    color += LETTERS[number];
  }
  return color;
}

export default getRandomColor;
