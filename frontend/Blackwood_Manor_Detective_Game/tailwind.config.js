/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#07070a',
          900: '#0e0f14',
          850: '#14161f',
          800: '#1a1d28',
          750: '#222533',
          700: '#2b2f40',
          600: '#3d425a',
        },
        sepia: {
          100: '#fdfaf3',
          200: '#f5edd8',
          300: '#e8dbbe',
          400: '#d5be94',
          500: '#bc9c65',
          600: '#947541',
        },
        amberGold: {
          400: '#fbbf24',
          500: '#d97706',
          600: '#b45309',
        },
        crimson: {
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
        }
      },
      fontFamily: {
        cinzel: ['"Cinzel"', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        typewriter: ['"Courier Prime"', 'Courier', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'noir-glow': '0 0 25px rgba(217, 119, 6, 0.25)',
        'blood-glow': '0 0 25px rgba(185, 28, 28, 0.35)',
        'vignette': 'inset 0 0 100px rgba(0, 0, 0, 0.85)',
      }
    },
  },
  plugins: [],
}
