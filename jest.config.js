/** @type {import('jest').Config} */
const config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/*.test.ts'],
	moduleFileExtensions: ['ts', 'js'],
};

module.exports = config;
