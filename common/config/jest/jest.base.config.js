import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  preset: 'ts-jest',
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['tests/fixtures'],
  setupFilesAfterEnv: [path.resolve(__dirname, './jest-setup-import-jest-dom.js')]
};
