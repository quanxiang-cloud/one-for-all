import base from '../../common/config/jest/jest.base.config.js';

export default {
  ...base,
  name: '@one-for-all/page-engine-v2',
  displayName: 'Page Engine v2',
  testMatch: ["**/tests/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleNameMapper: {
    "\\.(css|scss|less)$": "jest-css-modules",
  },
};
