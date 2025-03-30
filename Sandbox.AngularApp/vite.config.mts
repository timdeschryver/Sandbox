/// <reference types="vitest" />
import angular from '@analogjs/vite-plugin-angular';
import viteTsConfigPaths from 'vite-tsconfig-paths';

import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
	return {
		plugins: [angular(), viteTsConfigPaths()],
		test: {
			globals: true,
			environment: 'jsdom',
			// Uncomment to run tests in the browser
			// browser: {
			// 	enabled: true,
			// 	name: 'chromium',
			// 	headless: false, // set to true in CI
			// 	provider: 'playwright',
			// },
			setupFiles: ['src/test-setup.ts'],
			include: ['**/*.spec.ts'],
			reporters: ['default'],
		},
		define: {
			'import.meta.vitest': mode !== 'production',
		},
	};
});
