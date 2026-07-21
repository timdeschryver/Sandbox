import angular from 'angular-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
	{ ignores: ['dist', '**/coverage'] },
	{
		files: ['**/*.ts'],
		extends: [...angular.configs.tsAll],
		processor: angular.processInlineTemplates,
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
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
		extends: [...angular.configs.templateAll, ...angular.configs.templateAccessibility],
		rules: {
			// i18n is not used in this project
			'@angular-eslint/template/i18n': 'off',
			// Signals need to be called in the template
			'@angular-eslint/template/no-call-expression': 'off',
			'@angular-eslint/template/cyclomatic-complexity': 'off',
		},
	},
);
