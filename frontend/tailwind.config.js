/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      futura: ['Futura PT', 'sans-serif'],
    },
    fontSize: {
      ssm: ['13px', '18px'],
      sm: ['14px', '18.2px'],
      base: ['16px', '24px'],
      lg: ['20px', '28px'],
      xl: ['24px', '32px'],
      sti: ['26px', '33.8px'],
      ti: ['32px', '41.6px'],
    },
    colors: {
      bg: {
        primary: '#FF4B55',
        primary1: '#FF4B551F',
        secondary: '#FF4B55',
        white: '#FFFFFF',
        gray: '#F5F5F5',
        gray_1: '#F5F6F6',
        black: '#000000',
        green: '#17C961',
        green1: '#17C9611F',
      },
      text: {
        main: '#242424',
        gray: '#98A4A8',
        lightgray: '#F5F6F6',
        input_bg: '#F5F6F6',
        hyperlink: '#0ea5e9',
      },
    },
    extend: {
      padding: {
        base: '15px',
      },
    },
  },
  plugins: [],
};
