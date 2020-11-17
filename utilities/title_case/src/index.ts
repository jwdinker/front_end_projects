/*
  1. Match but do not capture one of the following characters exist:
  - the start of the line 
  - whitespace 
  - a dash  
  2. Capture where there follows a lowercase letter with an uppercase variant. 
*/
const TITLE_CASE = /(?:^|\s|-)(\p{Ll})/gmu;

const upperCase = (text: string) => {
  return String.prototype.toUpperCase.call(text);
};

function titleCase(text: string) {
  const isTextValid = typeof text === 'string';

  if (!isTextValid) {
    throw new TypeError('the text argument must be a string.');
  }

  const value = text.replace(TITLE_CASE, upperCase);
  return value;
}

export default titleCase;
