import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        ink:   { DEFAULT: '#2b2a28', soft: '#6b6862', faint: '#9a968f' },
        paper: { DEFAULT: '#faf8f5', edge: '#e8e3db' },
        sage:  { DEFAULT: '#7a8b6f', deep: '#6b7c60' },
      },
    },
  },
} satisfies Config;
