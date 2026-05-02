/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        base: {
          900: '#0B0F1A',
          800: '#111827',
          700: '#1F2937',
          500: '#4B5563',
        },
        neon: {
          500: '#38BDF8',
          400: '#22D3EE',
        },
        violet: {
          500: '#7C3AED',
          400: '#A78BFA',
        },
      },
      boxShadow: {
        glass: '0 10px 30px rgba(15, 23, 42, 0.45)',
        neon: '0 0 24px rgba(56, 189, 248, 0.45)',
      },
      backgroundImage: {
        'radial-dark':
          'radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 55%), radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.2), transparent 45%)',
        'hero-gradient':
          'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.8), rgba(17, 24, 39, 0.9))',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
