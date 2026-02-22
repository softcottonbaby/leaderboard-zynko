module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'pulse-cyan': 'pulseCyan 4s ease-in-out infinite',
        'floatItem': 'floatItem 20s linear infinite',
        'fadeIn': 'fadeIn 0.6s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        pulseCyan: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        },
        floatItem: {
          '0%': { transform: 'translateY(100vh) rotate(0deg) scale(1)', opacity: 0 },
          '10%': { opacity: 1 },
          '50%': { transform: 'translateY(50vh) rotate(180deg) scale(1.1)', opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(-150px) rotate(360deg) scale(1)', opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      transitionDuration: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [
    // Add custom scrollbar plugin
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'rgba(255, 80, 80, 0.3) transparent',
        },
        '.scrollbar-thumb-red-900': {
          '&::-webkit-scrollbar-thumb': {
            'background-color': 'rgba(127, 29, 29, 0.5)',
            'border-radius': '3px',
          },
        },
        '.scrollbar-track-transparent': {
          '&::-webkit-scrollbar-track': {
            'background-color': 'transparent',
          },
        },
      });
    },
  ],
};