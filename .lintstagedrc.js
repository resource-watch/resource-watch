// todo: replace with https://nextjs.org/docs/basic-features/eslint#lint-staged when the app uses next@12
module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'yarn check-types',

  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `yarn eslint --fix ${filenames.join(' ')}`,
    `yarn prettier --write ${filenames.join(' ')}`,
  ],

  // '*.{ts,tsx}': (filenames) =>
  //   `eslint --config ./.eslintrc.json --fix ${filenames.map(
  //     (file) => `.${file.split(process.cwd())[1]}`,
  //   )}`,
};
