const path = require('path');
const ResolveTypeScriptPlugin = require('resolve-typescript-plugin').default;

/**
 * Storybook Workaround: https://github.com/storybookjs/storybook/issues/14877#issuecomment-1000441696
 */
const replaceFileExtension = (filePath, newExtension) => {
  const { name, root, dir } = path.parse(filePath);
  return path.format({
    name,
    root,
    dir,
    ext: newExtension,
  });
};

module.exports = {
  stories: ['../src/stories/**/*.stories.mdx', '../src/stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/preset-scss',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config) => {
    // Find the plugin instance that needs to be mutated
    const virtualModulesPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === 'VirtualModulesPlugin',
    );

    // Change the file extension to .cjs for all files that end with "generated-stories-entry.js"
    virtualModulesPlugin._staticModules = Object.fromEntries(
      Object.entries(virtualModulesPlugin._staticModules).map(([key, value]) => {
        if (key.endsWith('generated-stories-entry.js')) {
          return [replaceFileExtension(key, '.cjs'), value];
        }
        return [key, value];
      }),
    );

    // Change the entry points to point to the appropriate .cjs files
    config.entry = config.entry.map((entry) => {
      if (entry.endsWith('generated-stories-entry.js')) {
        return replaceFileExtension(entry, '.cjs');
      }
      return entry;
    });

    config.resolve = {
      ...config.resolve,
      plugins: [new ResolveTypeScriptPlugin()],
    };

    config.module.rules.push({
      test: /\.(js|mjs|jsx|.ts)$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
};
