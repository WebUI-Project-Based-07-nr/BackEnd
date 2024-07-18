module.exports = {
  roots: ['<rootDir>/src/test'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1'
  },
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '!<rootDir>/node_modules/*',
    '!<rootDir>/src/test/**/*',
    '!<rootDir>/src/consts/*',
    '!<rootDir>/src/configs/*',
    '!<rootDir>/docs/*',
    '!<rootDir>/src/emails/*',
    '!<rootDir>/*.json',
    '!<rootDir>/*.yaml'
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  },
  coverageReporters: ['html', 'lcov'],
  coverageDirectory: '<rootDir>/src/test/coverage',
  testTimeout: 12000,
  testMatch: [
    '<rootDir>/src/test/integration/**/*.spec.js',
    '<rootDir>/src/test/unit/**/*.spec.js'
  ],
  testResultsProcessor: 'jest-sonar-reporter'
}
