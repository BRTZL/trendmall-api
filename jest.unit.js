import sharedConfig from "./jest.config"

module.exports = {
  ...sharedConfig,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "cobertura"],
  collectCoverageFrom: ["src/**/*.ts", "!*/node_modules/**", "!src/main.ts"],
  reporters: ["default", "jest-sonar"],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
}
