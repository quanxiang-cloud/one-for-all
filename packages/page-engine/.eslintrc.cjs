// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: [
    '@rushstack/eslint-config/profile/web-app',
    '@rushstack/eslint-config/mixins/react',
    '@rushstack/eslint-config/mixins/friendly-locals',
    '@rushstack/eslint-config/mixins/tsdoc',
  ],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    '@typescript-eslint/typedef': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
    ],
    // indent: ['error', 2],
    // quotes: ['error', 'single'],
    // semi: ['error', 'always'],
    // 'space-infix-ops': ['error', { 'int32Hint': false }],
    // 'arrow-parens': ['error', 'always'],
    // 'no-multi-spaces': 'error'
  },
};
