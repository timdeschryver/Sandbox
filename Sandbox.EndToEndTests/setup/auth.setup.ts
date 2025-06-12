import { expect, test } from '@playwright/test';
import * as fs from 'node:fs';

const storageState = '.state/auth-state.json';

test('authenticate user', async ({ page }) => {
	// eslint-disable-next-line playwright/no-skipped-test
	test.skip(
		isRecentlyAuthenticated(storageState),
		'Skipping authentication test because user is already authenticated',
	);

	await page.goto('/bff/login');

	await page.getByRole('textbox', { name: 'Email address' }).click();
	await page.getByRole('textbox', { name: 'Email address' }).fill('playwright@timdeschryver.dev');
	await page.getByRole('textbox', { name: 'Email address' }).press('Enter');

	await page.getByRole('textbox', { name: 'Password' }).click();
	await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
	await page.getByRole('textbox', { name: 'Password' }).press('Enter');

	await expect(
		page.getByRole('heading', {
			name: /👋 hello, playwright@timdeschryver\.dev/i,
		}),
	).toBeVisible();
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
