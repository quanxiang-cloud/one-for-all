// Only use the following if you use tsconfig paths
// const tsconfig = require('./tsconfig.json')
// const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig)

module.exports = {
  ...require('../../jest.config'),
  testEnvironment: 'jsdom',
  name: '@ofa/render-engine',
  displayName: 'Render Engine',
  modulePathIgnorePatterns: ['__tests__/fixtures']
  // moduleNameMapper,
};
