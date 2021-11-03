import base from '../../jest.base.config.js';

export default {
  ...base,
  name: '@ofa/render-engine',
  displayName: 'Render Engine',
  // transform: {},
  transformIgnorePatterns: ['packages/utils'],
  // moduleNameMapper: {
  //   '^@ofa/utils/(.*)$': '<rootDir>/packages/utils/$1',
  // },
};
