/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    testEnvironment: 'node',
    clearMocks: true,
    coverageDirectory: 'coverage',

    testPathIgnorePatterns: ['/node_modules/', '/__tests__/setup.ts'],

    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.jest.json',
                useESM: true,
            },
        ],
    },
};
