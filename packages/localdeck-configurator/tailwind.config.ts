import typography from '@tailwindcss/typography';
import rippleui from 'rippleui';

const colors = {
  primary: '#152637',
  secondary: '#0090CD',
  info: '#3DBBAA',
};

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,vue,md}',
  ],
  plugins: [
    typography,
    rippleui,
  ],
  theme: {
    extend: { colors },
    fontFamily: {
      display: ['Poppins', 'sans-serif', '"BabelStone Flags"'],
      body: ['"Open Sans"', 'sans-serif', '"BabelStone Flags"'],
    },
  },
};
