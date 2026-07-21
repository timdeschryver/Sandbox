/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	plugins: ['prettier-plugin-tailwindcss'],
	printWidth: 120,
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	overrides: [
		{
			files: 'projects/*/src/app/**/*.html',
			options: {
				parser: 'angular',
			},
		},
	],
};

export default config;
