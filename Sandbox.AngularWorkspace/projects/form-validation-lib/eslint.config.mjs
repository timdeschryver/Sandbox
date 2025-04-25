// @ts-check
import tseslint from 'typescript-eslint';
import rootConfig from '../../eslint.config.mjs';

export default tseslint.config(...rootConfig, {
	files: ['**/*.ts'],
	rules: {
		'@angular-eslint/directive-selector': [
			'error',
			{
				type: 'attribute',
				prefix: 'formValidation',
				style: 'camelCase',
			},
		],
		'@angular-eslint/component-selector': [
			'error',
			{
				type: 'element',
				prefix: 'form-validation',
				style: 'kebab-case',
			},
		],
	},
});
