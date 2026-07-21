import playwright from 'eslint-plugin-playwright';
import { defineConfig } from 'oxlint';

export default defineConfig({
	categories: {
		correctness: 'error',
	},
	ignorePatterns: [
		'**/.angular/**',
		'**/build/**',
		'**/coverage/**',
		'**/dist/**',
		'**/node_modules/**',
		'**/playwright-report/**',
		'**/test-results/**',
	],
	overrides: [
		{
			files: ['Sandbox.AngularWorkspace/**/*.ts'],
			rules: {
				'no-restricted-imports': [
					'error',
					{
						patterns: [
							{
								group: ['..*'],
								message: "Relative imports are not allowed, use the '@' path instead.",
							},
						],
					},
				],
				'no-unused-vars': [
					'error',
					{
						argsIgnorePattern: '^_',
						caughtErrorsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
					},
				],
				'typescript/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
				'typescript/no-deprecated': 'error',
			},
		},
		{
			files: ['Sandbox.EndToEndTests/**/*.ts'],
			jsPlugins: ['eslint-plugin-playwright'],
			rules: playwright.configs['flat/recommended'].rules,
		},
	],
});
