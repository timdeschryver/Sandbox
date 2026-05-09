import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

// Note: https://angular.dev/guide/testing#advanced-vitest-configuration
// IMPORTANT: While using a custom configuration enables advanced options, the Angular team does not provide support for the contents of the configuration file or for any third-party plugins. The CLI will also override certain properties (test.projects, test.include) to ensure proper integration.

export default defineConfig({
	test: {
		silent: 'passed-only',
		reporters: process.env['GITHUB_ACTIONS'] === 'true' ? ['dot', 'github-actions'] : ['agent'],
		browser: {
			enabled: true,
			provider: playwright(),
			instances: [{ browser: 'chromium' }],
			headless: true,
		},
		coverage: {
			provider: 'v8',
			reporter: ['json-summary', 'json'],
		},
	},
});
