/** EXAMPLE TAILWIND CONFIG */

require('dotenv').config();

import forms from '@tailwindcss/forms';
import defaultTheme from 'tailwindcss/defaultTheme';

const plugin = require('tailwindcss/plugin');

const primaryColor = process.env.VITE_THEME_PRIMARY_COLOR || 'green';
const darkModeColor = process.env.VITE_THEME_DARK_COLOR || '#3b4a63';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  
  theme: {
    extend: {
      colors: {
        primary: generateColorPalette(primaryColor),
        dark: generateColorPalette(darkModeColor),
      },
    },
  },

  plugins: [
    forms,
    plugin(({ addUtilities }) =>
      addUtilities({
        ...class_square(),
        ...class_gradient_primary(),
      }),
    ),
  ],
};

function class_square() {
  let classes = {};
  for (let i = 1; i <= 100; i++) {
    classes[`.square-${i}`] = {
      height: `${i}rem`,
      width: `${i}rem`,
    };
  }
  return classes;
}

function class_gradient_primary() {
  const colors = ['black', 'white'];
  let classes = {};

  for (let i = 1; i <= 360; i++) {
    colors.forEach((color) => {
      classes[`.bg-primary-gradient-${color}-${i}`] = {
        background: getGradient(primaryColor, color, i),
      };
      classes[`.bg-primary-gradient-${color}-reverse-${i}`] = {
        background: getGradient(color, primaryColor, i),
      };
    });
  }
  return classes;
}

function generateColorPalette(color) {
  return {
    50: getColorMix(color, 95, 'white'),
    100: getColorMix(color, 90, 'white'),
    200: getColorMix(color, 70, 'white'),
    300: getColorMix(color, 50, 'white'),
    400: getColorMix(color, 30, 'white'),
    500: color,
    600: getColorMix(color, 30, 'black'),
    700: getColorMix(color, 50, 'black'),
    800: getColorMix(color, 70, 'black'),
    900: getColorMix(color, 90, 'black'),
    950: getColorMix(color, 95, 'black'),
  };
}

function getGradient(startColor, endColor, angle = '90') {
  return `linear-gradient(${angle}deg, ${startColor}, ${endColor})`;
}

function getColorMix(color, intensity, mixWithColor) {
  return `color-mix(in srgb, ${color}, ${mixWithColor} ${intensity}%)`;
}
