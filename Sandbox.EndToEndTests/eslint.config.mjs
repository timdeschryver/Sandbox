// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
	{
		ignores: ['playwright-report', 'test-results'],
	},
	eslint.configs.recommended,
	tseslint.configs.recommended,
	playwright.configs['flat/recommended'],
	eslintConfigPrettier,
	{
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
);
