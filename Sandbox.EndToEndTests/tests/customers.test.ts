import { test, expect } from '@playwright/test';
import { generateRandomString } from '../utils';

test('creates a new customer and can open details', { tag: '@customer-management' }, async ({ page }) => {
	await page.goto('/customers');

	const firstName = generateRandomString(8);
	const lastName = generateRandomString(10);

	const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
	const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
	const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
	const streetTextbox = page.getByRole('textbox', { name: 'Street' });
	const cityTextbox = page.getByRole('textbox', { name: 'City' });
	const zipCodeTextbox = page.getByRole('textbox', { name: 'Zip Code' });

	await test.step(`create customer`, async () => {
		await firstNameTextbox.fill(firstName);
		await lastNameTextbox.fill(lastName);
		await addBillingAddressCheckbox.check();
		await streetTextbox.fill('b street');
		await cityTextbox.fill('b city');
		await zipCodeTextbox.fill('b zip');
		await zipCodeTextbox.press('Enter');
	});

	await test.step(`verify customer is created`, async () => {
		const customerCell = page.getByRole('cell', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		await expect(customerCell).toBeVisible();
	});

	await test.step(`open customer details`, async () => {
		const customerRow = page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		const customerDetailsLink = customerRow.getByRole('link', { name: /details/i });

		await customerDetailsLink.click();

		await expect(page.locator('sandbox-customer-details')).toMatchAriaSnapshot(`
- heading "Customer Details" [level=2]
- link "Back to Overview":
  - /url: /customers
- group "Personal Information": Personal Information Name:${firstName} ${lastName}
- group "Billing Addresses": Billing Addresses Street:b street City:b city Zip Code:b zip
`);
		expect(page.url()).toMatch(/\/customers\/[\w-]+/i);
	});
});
