import { test, expect } from '@playwright/test';
import { generateRandomString } from '../utils';

test('creates a new customer and can open details', { tag: '@customer-management' }, async ({ page }) => {
	await page.goto('/customers');

	const firstName = generateRandomString(8);
	const lastName = generateRandomString(10);

	await test.step(`create customer`, async () => {
		await page.getByRole('textbox', { name: 'First Name' }).click();
		await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
		await page.getByRole('textbox', { name: 'First Name' }).press('Tab');
		await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
		await page.getByRole('textbox', { name: 'Last Name' }).press('Tab');
		await page.getByRole('checkbox', { name: 'Add Billing Address' }).check();
		await page.getByRole('checkbox', { name: 'Add Billing Address' }).press('Tab');
		await page.getByRole('textbox', { name: 'Street' }).fill('billing street');
		await page.getByRole('textbox', { name: 'Street' }).press('Tab');
		await page.getByRole('textbox', { name: 'City' }).fill('billing city');
		await page.getByRole('textbox', { name: 'City' }).press('Tab');
		await page.getByRole('textbox', { name: 'Zip Code' }).fill('billing zip');
		await page.getByRole('textbox', { name: 'Zip Code' }).press('Enter');

		await expect(page.getByRole('cell', { name: `${firstName} ${lastName}` })).toBeVisible();
	});

	await test.step(`open customer details`, async () => {
		await page
			.getByRole('row', { name: `${firstName} ${lastName}` })
			.getByRole('link')
			.click();

		await expect(page.locator('sandbox-customer-details')).toMatchAriaSnapshot(`
- heading "Customer Details" [level=2]
- link "Back to Overview":
  - /url: /customers
- group "Personal Information": Personal Information Name:${firstName} ${lastName}
- group "Billing Addresses": Billing Addresses Street:billing street City:billing city Zip Code:billing zip
`);
		expect(page.url()).toMatch(/\/customers\/[\w-]+/);
	});
});
