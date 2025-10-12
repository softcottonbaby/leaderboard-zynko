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
        background: '#0a0000', // custom dark background
        redGlow: 'rgba(255, 80, 80, 0.3)', // custom glow
      },
      boxShadow: {
        red: '0 0 12px rgba(255, 80, 80, 0.4)',
        redHover: '0 0 18px rgba(255, 80, 80, 0.6)',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        bounceSlow: 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      blur: {
        full: '160px',
      },
    },
  },
  plugins: [],
}
