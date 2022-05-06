import base from '../../common/config/jest/jest.base.config.js';

export default {
  ...base,
  name: '@one-for-all/headless-ui',
  moduleNameMapper: {
    '\\.(css|scss|less)$': 'jest-css-modules',
    '@one-for-all/icon': '<rootDir>../icon/lib/src',
  },
};
