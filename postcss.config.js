module.exports = {
  plugins: [
    [
      'postcss-easy-import', // keep this first
      {
        prefix: '_',
      },
    ],
    'autoprefixer', // so imports are auto-prefixed too
  ],
};
