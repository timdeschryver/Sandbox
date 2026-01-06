// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
	{ ignores: ['dist', '**/coverage'] },
	{
		files: ['**/*.ts'],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.strictTypeChecked,
			...tseslint.configs.stylistic,
			...angular.configs.tsAll,
			eslintConfigPrettier,
		],
		processor: angular.processInlineTemplates,
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{ group: ['..*'], message: "Relative imports are not allowed, use the '@' path instead." },
					],
				},
			],
			'sort-imports': [
				'error',
				{
					ignoreDeclarationSort: true,
				},
			],
			'@typescript-eslint/no-deprecated': 'error',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					fixStyle: 'inline-type-imports',
				},
			],
			'@angular-eslint/no-experimental': 'off',
			'@angular-eslint/no-developer-preview': 'off',
			'@angular-eslint/component-class-suffix': 'off',
			'@angular-eslint/directive-class-suffix': 'off',
			'@angular-eslint/component-max-inline-declarations': [
				'error',
				{
					template: 25,
				},
			],
		},
	},
	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateAll, ...angular.configs.templateAccessibility, eslintConfigPrettier],
		rules: {
			// i18n is not used in this project
			'@angular-eslint/template/i18n': 'off',
			// Signals need to be called in the template
			'@angular-eslint/template/no-call-expression': 'off',
			'@angular-eslint/template/cyclomatic-complexity': 'off',
		},
	},
);
