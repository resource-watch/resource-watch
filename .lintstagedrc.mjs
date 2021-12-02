// todo: replace with https://nextjs.org/docs/basic-features/eslint#lint-staged when the app uses next@12
export default {
  '**/*.(ts|tsx)': () => 'yarn check-types',

  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `yarn eslint --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
  ],
}
