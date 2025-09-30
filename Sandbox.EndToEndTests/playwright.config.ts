import { defineConfig, devices } from '@playwright/test';
import { getConfig } from 'utils/env';

const config = getConfig();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	tsconfig: './tsconfig.json',
	testDir: './tests',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: process.env.CI ? [['github'], ['html'], ['dot']] : process.env['ASPIRE'] ? 'list' : 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: config.applicationUrl,

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'setup',
			testDir: './setup',
			testMatch: '**/*.setup.ts',
		},

		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], storageState: '.state/auth-state.json' },
			dependencies: ['setup'],
		},

		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'], storageState: '.state/auth-state.json' },
			dependencies: ['setup'],
		},

		{
			name: 'teardown',
			testDir: './setup',
			testMatch: '**/*.teardown.ts',
			dependencies: ['chromium', 'firefox'],
		},

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		cwd: '..',
		command: 'dotnet run --project ./Sandbox.AppHost',
		url: config.applicationUrl,
		reuseExistingServer: !process.env.CI,
		timeout: 60000 * 5,
	},
});
