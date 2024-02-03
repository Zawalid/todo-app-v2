/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'background-primary': 'var(--background-primary)',
        'background-secondary': 'var(--background-secondary)',
        'background-tertiary': 'var(--background-tertiary)',
        'background-disabled': 'var(--background-disabled)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-disabled': 'var(--text-disabled)',
        border: 'var(--border)',
        'custom-1': 'var(--custom-1)',
        'custom-2': 'var(--custom-2)',
        'custom-3': 'var(--custom-3)',
        'custom-4': 'var(--custom-4)',
        'custom-5': 'var(--custom-5)',
        'custom-6': 'var(--custom-6)',
        'custom-7': 'var(--custom-7)',
        'custom-8': 'var(--custom-8)',
        'custom-9': 'var(--custom-9)',
        'custom-10': 'var(--custom-10)',
      },
      keyframes: {
        scaleUp: {
          '0%': { transform: 'translate(-50%, -50%) scale(0)' },
          '60% , 100%': { transform: 'translate(-50%, -50%)  scale(1)' },
        },
        pulse2: {
          '0% , 60% , 100%': { transform: '  scale(1) ' },
          '80% ': { transform: '  scale(1.2)' },
        },
      },
      animation: {
        scaleUp: 'scaleUp 1s linear infinite',
        pulse2: 'pulse2 1s linear infinite',
      },
      screens: {
        xs: '380px',
      },
      transitionProperty: {
        menu: 'width, transform, opacity, inset',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.child-padding': {
          '> *': {
            paddingInline: '1.25rem',
          },
          '@media (min-width: 640px)': {
            '> *': {
              paddingInline: '2rem',
            },
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
