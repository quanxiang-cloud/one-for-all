import base from '../../common/config/jest/jest.base.config.js';

export default {
  ...base,
  name: '@one-for-all/render-engine',
  displayName: 'Render Engine',
  setupFilesAfterEnv: ['./scripts/mock-ofa-utils.ts'].concat(base.setupFilesAfterEnv),
};
