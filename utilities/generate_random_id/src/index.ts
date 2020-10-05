// from: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php

function generateRandomId(): string {
  let date = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const randomNumber = (date + Math.random() * 16) % 16 | 0;
    date = Math.floor(date / 16);
    return (c === 'x' ? randomNumber : (randomNumber & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export default generateRandomId;
