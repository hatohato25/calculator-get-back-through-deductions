/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // html要素のclassで制御（<html class="dark">）
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        tablet: '768px',
        desktop: '1024px',
      },
    },
  },
  plugins: [],
};
