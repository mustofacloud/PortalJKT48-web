module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeSlideUp: 'fadeSlideUp 0.7s ease-out forwards',
      },
    },
  },
};
