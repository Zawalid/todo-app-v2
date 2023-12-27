/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'background-primary': '#FFFFFF',
        'background-secondary': '#F4F4F4',
        'background-tertiary': '#EBEBEB',
        'text-primary': '#212529',
        'text-secondary': '#444444',
        'text-tertiary': '#7C7C7C',
        'text-error': '#FF0000',
        'primary-hover' : '#4f46e5',
        'primary' : '#6366f1',
        'custom-1': '#ff6b6b',
        'custom-2': '#da77f2',
        'custom-3': '#9775fa',
        'custom-4': '#64c37e',
        'custom-5': '#66d9e8',
        'custom-6': '#8ce99a',
        'custom-7': '#ffd43b',
        'custom-8': '#ff922b',
        'custom-9': '#ffb6b9',
        'custom-10': '#d9a7f3',
        'custom-11': '#b0a1f5',
        'custom-12': '#75e0a3',
        'custom-13': '#7ed1d9',
        'custom-14': '#a7f0b2',
        'custom-15': '#ffda77',
        'custom-16': '#ffc77f',
        'custom-17': '#c8ff2d',
        'custom-18': '#605050',
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
    },
  },
  plugins: [],
};
