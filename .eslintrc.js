module.exports = {
  extends: [
    // 'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    // 'plugin:cypress/recommended',
    // 'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['import'],
  rules: {
    'import/no-unresolved': 'off',
    'react/jsx-props-no-spreading': 'off',
    // 'react-hooks/exhaustive-deps': 'warn',
    // 'react-hooks/rules-of-hooks': 'error',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/button-has-type': 'off',
    // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    // ---
    'no-console': [
      'warn',
      {
        allow: [
          'warn',
          'error',
        ],
      },
    ],
    'react/jsx-filename-extension': 'off',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
