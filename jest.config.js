/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  modulePathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/demo/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-linear-gradient)/)',
  ],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/__tests__/**', '!src/**/*.d.ts'],
};
