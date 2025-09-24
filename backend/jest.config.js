/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: {},
  testTimeout: 300000,
  forceExit: true
};

export default config;

