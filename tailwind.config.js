/* eslint-disable @typescript-eslint/no-var-requires */
const typography = require('@tailwindcss/typography');
const lineClamp = require('@tailwindcss/line-clamp');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './layout/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.darkest'),
            lineHeight: 1.625,
          },
        },
      }),
    },
    fontFamily: {
      sans: ['Lato', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
    },
    fontSize: {
      '3xs': '0.625rem',
      '2xs': '0.75rem',
      xs: '0.815rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.625rem',
      xl: '2.625rem',
      '2xl': '4rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      bold: 700,
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      gray: {
        darkest: '#393f44',
        dark: '#717171',
        DEFAULT: '#caccd0',
        light: '#f0f1f2',
      },
      red: {
        DEFAULT: '#d0021b',
      },
      yellow: {
        DEFAULT: '#fab72e',
      },
      green: {
        DEFAULT: '#65b60d',
      },
      blue: {
        DEFAULT: '#2c75b0',
        light: '#3bb2d0',
      },
      pink: {
        DEFAULT: '#c32d7b',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [typography, lineClamp],
};
