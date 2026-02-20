import prettierConfig from '../.prettierrc.mjs';

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	...prettierConfig,
	plugins: ['prettier-plugin-tailwindcss'],
	overrides: [
		{
			files: 'Sandbox.AngularWorkspace/**/*.html',
			options: {
				parser: 'angular',
			},
		},
	],
};

export default config;
