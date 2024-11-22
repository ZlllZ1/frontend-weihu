const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      ...colors,
      blue: '#1172F6',
      gray: '#8491A5',
      lightBlue: colors.sky,
      warmGray: colors.stone,
      trueGray: colors.neutral,
      coolGray: colors.gray,
      blueGray: colors.slate
    },
    extend: {}
  },
  plugins: []
}
