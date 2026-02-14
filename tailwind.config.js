// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0000',
        redGlow: 'rgba(255, 80, 80, 0.3)',
      },
      boxShadow: {
        red: '0 0 12px rgba(255, 80, 80, 0.4)',
        redHover: '0 0 18px rgba(255, 80, 80, 0.6)',
      },
      animation: {
        // Fades in once, then loops float gently
        'fadeIn-float': 'fadeIn 1.2s ease-out forwards, floatPulse 5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        // smooth pulse/float motion toward center text
        floatPulse: {
          '0%, 100%': {
            transform: 'translateY(0px) scale(1)',
          },
          '50%': {
            transform: 'translateY(-10px) scale(1.08)',
          },
        },
      },
    },
  },
  plugins: [],
};
