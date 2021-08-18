// const tsconfig = require('./tsconfig.json')
// const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig)

module.exports = {
  ...require('../../jest.config'),
  testEnvironment: 'jsdom',
  name: '@ofa/spec-interpreter',
  displayName: 'Spec Interpreter',
  // moduleNameMapper,
};
