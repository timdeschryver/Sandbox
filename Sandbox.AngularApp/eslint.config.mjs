// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
	{
		files: ['**/*.ts'],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.strict,
			...tseslint.configs.stylistic,
			...angular.configs.tsAll,
			eslintConfigPrettier,
		],
		processor: angular.processInlineTemplates,
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'sandbox',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'sandbox',
					style: 'kebab-case',
				},
			],
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
					patterns: [{ group: ['.*'], message: "Relative imports are not allowed, use the '@' path instead." }],
				},
			],
		},
	},
	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateAll, ...angular.configs.templateAccessibility, eslintConfigPrettier],
		rules: {
			// we don't use i18n in this project
			'@angular-eslint/template/i18n': 'off',
			// signals need to be called in the template
			'@angular-eslint/template/no-call-expression': 'off',
		},
	},
);
