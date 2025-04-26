import { expect, test } from '@playwright/test';
import * as fs from 'node:fs';

const storageState = '.state/auth-state.json';

test('authenticate user', async ({ page }) => {
	console.log(`\x1b[2m\tSign in started'\x1b[0m`);

	const isAuthenticated = fs.existsSync(storageState);
	// eslint-disable-next-line playwright/no-conditional-in-test
	if (isAuthenticated) {
		console.log(`\x1b[2m\tSign in skipped because user is already authenticated\x1b[0m`);
		return;
	}
	console.log(`\x1b[2mSigning in'\x1b[0m`);

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
