import base from '../../common/config/jest/jest.base.config.js';

export default {
  ...base,
  name: '@one-for-all/artery-engine',
  displayName: 'artery engine',
  testMatch: ["**/tests/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleNameMapper: {
    "\\.(css|scss|less)$": "jest-css-modules",
  },
};
