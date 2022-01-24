import path from 'path';
import { fileURLToPath } from 'url';
import { lstatSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.resolve(__dirname, 'packages');
const packages = readdirSync(basePath).filter((name) => {
  return lstatSync(path.join(basePath, name)).isDirectory();
});

const mapper = packages.reduce((mapper, name) => {
  mapper[`@one-for-all/${name}`] = path.join(basePath, name, 'src');
  return mapper;
}, {});

export default {
  preset: 'ts-jest',
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['__tests__/fixtures'],
  moduleNameMapper: mapper,
  setupFilesAfterEnv: [path.resolve(__dirname, 'scripts/jest-setup-import-jest-dom.ts')]
};
