require('dotenv').config();

import forms from '@tailwindcss/forms';
import defaultTheme from 'tailwindcss/defaultTheme';

const plugin = require('tailwindcss/plugin');

const primaryColor = process.env.VITE_THEME_PRIMARY_COLOR || 'green';
const darkModeColor = process.env.VITE_THEME_DARK_COLOR || '#3b4a63';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',

    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: generateColorPalette(primaryColor),
                dark: generateColorPalette(darkModeColor),
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-out': {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out forwards',
                'fade-out': 'fade-out 0.3s ease-out forwards',
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

// Generates custom class square-[rem_count].
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

// Generates custom class bg-primary-gradient-[color]-[int].
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

/**
 * Generates a custom color palette that mimics tailwinds native palettes.
 * Set provided color as 500 and generate lighter (<500) and darker (>500) shades
 */
function generateColorPalette(color) {
    const light = adjustColorShade(color, 230);
    const dark = adjustColorShade(color, -230);

    return {
        50: getColorMix(color, 95, light),
        100: getColorMix(color, 88, light),
        200: getColorMix(color, 75, light),
        300: getColorMix(color, 50, light),
        400: getColorMix(color, 20, light),
        500: color,
        600: getColorMix(color, 10, dark),
        700: getColorMix(color, 25, dark),
        800: getColorMix(color, 40, dark),
        900: getColorMix(color, 55, dark),
        950: getColorMix(color, 75, dark),
    };
}

/**
 * Darken/lighten the shade of provided color by a set amount.
 * Makes lighter if [amount > 0], darker if [amount < 0]
 */
function adjustColorShade(hex = '#ffffff', amount = 0) {
    if (!/^#?[0-9a-fA-F]{6}$/.test(hex)) return;

    const n = parseInt(hex.replace('#', ''), 16);
    const clamp = (v) => Math.min(255, Math.max(0, v));

    const r = clamp((n >> 16) + amount);
    const g = clamp(((n >> 8) & 255) + amount);
    const b = clamp((n & 255) + amount);

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Generate a color gradient, that starts with one color and transitions into another.
function getGradient(startColor, endColor, angle = '90') {
    return `linear-gradient(${angle}deg, ${startColor}, ${endColor})`;
}

// Mix a provided color with another, with custom instensity.
function getColorMix(color, intensity, mixWithColor) {
    return `color-mix(in srgb, ${color}, ${mixWithColor} ${intensity}%)`;
}
