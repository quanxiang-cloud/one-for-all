// Only use the following if you use tsconfig paths
// const tsconfig = require('./tsconfig.json')
// const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig)

module.exports = {
  ...require('../../jest.base.config'),
  name: '@ofa/render-engine',
  displayName: 'Render Engine',
  // moduleNameMapper,
};
