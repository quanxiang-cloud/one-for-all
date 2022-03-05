import base from '../../common/config/jest/jest.base.config.js';

export default {
  ...base,
  name: '@one-for-all/render-engine',
  displayName: 'Render Engine',
  setupFilesAfterEnv: ['./config/mock-ofa-utils.js'].concat(base.setupFilesAfterEnv),
  modulePathIgnorePatterns: ['<rootDir>/lib/'].concat(base.modulePathIgnorePatterns)
};
