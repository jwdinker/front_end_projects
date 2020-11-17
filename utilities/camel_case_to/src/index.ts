// capture lowercase character or digit instances junctioning with uppercase character.
const LOWERCASE_UPPERCASE_JUNCTION = /([\p{Ll}\d])(\p{Lu})/gu;

// capture instances of repeat uppercase characters followed by lowercase character.
const REPETITIOUS_UPPERCASE_TO_LOWERCASE = /(\p{Lu}+)(\p{Lu}\p{Ll}+)/gu;

function camelCaseTo(text: string, delimter = '-') {
  const isTextValid = typeof text === 'string';
  const isSeperatorValid = typeof delimter === 'string';
  const isValid = isTextValid && isSeperatorValid;
  if (!isValid) {
    throw new TypeError('the text and delimter must be of type string.');
  }
  const replacement = `$1${delimter}$2`;
  return text
    .replace(LOWERCASE_UPPERCASE_JUNCTION, replacement)
    .replace(REPETITIOUS_UPPERCASE_TO_LOWERCASE, replacement)
    .toLowerCase();
}

export default camelCaseTo;
