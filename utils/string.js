export const containsString = (substring, stringArray = []) => {
  let matches = false;

  stringArray.forEach((_string) => {
    if (substring.includes(_string)) matches = true;
  });

  return matches;
};

export default { containsString };
