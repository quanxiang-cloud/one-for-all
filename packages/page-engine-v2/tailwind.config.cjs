module.exports = {
  mode: "jit",
  darkMode: false,
  purge: [
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  theme: {
    colors: require('./colors.cjs'),
  }
}
