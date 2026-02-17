import { expect, test } from '@playwright/test';
import * as fs from 'node:fs';
import { getConfig } from '../utils/env';

const storageState = '.state/auth-state.json';

test('authenticate user', async ({ page }) => {
	// Load and validate configuration
	const config = getConfig();

	// eslint-disable-next-line playwright/no-skipped-test
	test.skip(
		isRecentlyAuthenticated(storageState),
		'Skipping authentication test because user is already authenticated',
	);

	await page.goto('/bff/login');

	const usernameInput = page.getByRole('textbox', { name: /Username/i });
	const passwordInput = page.getByRole('textbox', { name: /Password/i });

	await usernameInput.fill(config.username);

	await passwordInput.fill(config.password);
	await passwordInput.press('Enter');

	await expect(page.getByText(new RegExp(`${config.username}`, 'i'))).toBeVisible();
	await page.context().storageState({ path: storageState });
});

function isRecentlyAuthenticated(filePath: string): boolean {
	try {
		if (!fs.existsSync(filePath)) {
			return false;
		}

		const stats = fs.statSync(filePath);
		const fileAge = Date.now() - stats.mtime.getTime();
		const maxAge = 3600000; // 1 hour in milliseconds

		return fileAge < maxAge;
	} catch {
		return false;
	}
}
