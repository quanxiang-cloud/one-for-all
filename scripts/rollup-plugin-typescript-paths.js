import { join } from 'path';
import { findConfigFile, nodeModuleNameResolver, sys } from 'typescript';
import { parse as JsonParse } from 'comment-json';

export const typescriptPaths = ({ tsConfigPath = findConfigFile('./', sys.fileExists), absolute = true, transform, } = {}) => {
  const { compilerOptions, outDir } = getTsConfig(tsConfigPath);
  return {
    name: 'resolve-typescript-paths',
    resolveId: (importee, importer) => {
      if (typeof importer === 'undefined' || importee.startsWith('\0') || !compilerOptions.paths) {
        return null;
      }
      const hasMatchingPath = Object.keys(compilerOptions.paths).some(path => new RegExp(path.replace('*', '\\w*')).test(importee));
      if (!hasMatchingPath) {
        return null;
      }
      const { resolvedModule } = nodeModuleNameResolver(importee, importer, compilerOptions, sys);
      if (!resolvedModule) {
        return null;
      }
      const { resolvedFileName } = resolvedModule;
      if (!resolvedFileName || resolvedFileName.endsWith('.d.ts')) {
        return null;
      }
      // const jsFileName = join(outDir, resolvedFileName.replace(/\.tsx?$/i, '.js'));
      const jsFileName = join(outDir, resolvedFileName);
      let resolved = absolute ? sys.resolvePath(jsFileName) : jsFileName;
      if (transform) {
        resolved = transform(resolved);
      }
      return resolved;
    },
  };
};
const getTsConfig = (configPath) => {
  const defaults = { compilerOptions: {}, outDir: '.' };
  if (!configPath) {
    return defaults;
  }
  const configJson = sys.readFile(configPath);
  if (!configJson) {
    return defaults;
  }
  const config = JsonParse(configJson);
  return Object.assign(Object.assign({}, defaults), config);
};
/**
 * For backwards compatibility.
 */
export const resolveTypescriptPaths = typescriptPaths;
export default typescriptPaths;
