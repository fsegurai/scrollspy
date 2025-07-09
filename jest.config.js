export default {
    restoreMocks: true,
    clearMocks: true,
    // collectCoverage: true,
    collectCoverageFrom: ['**/src/**/*.{js,ts}', '!**/src/**/*.d.ts'],
    coverageDirectory: 'coverage',
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
    testEnvironment: 'node',
    testRegex: '(/spec/.*|(\\.|/)(test|spec))\\.[jt]s$',
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '\\.test-d\\.ts$'],
    transformIgnorePatterns: ['node_modules/(?!github-slugger)'],
};
