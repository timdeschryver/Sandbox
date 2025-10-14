// spec: specs/test-plan.md
// seed: setup/auth.setup.ts

import { test, expect } from '@playwright/test';

test.describe('Customer Management - Create Operations - Dynamic Form Behavior', () => {
	test('Dynamic Form Behavior - Toggle Billing Address', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// 2. Observe the form in initial state (billing address section hidden)
		const billingGroup = page.getByRole('group', { name: 'Billing Address' });
		await expect(billingGroup).toBeHidden();

		// 3. Check the "Add Billing Address" checkbox
		const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
		await addBillingAddressCheckbox.check();

		// 4. Observe the "Billing Address" section appears
		await expect(billingGroup).toBeVisible();

		// Verify: Fields include: Street, City, Zip Code
		await expect(billingGroup.getByRole('textbox', { name: 'Street' })).toBeVisible();
		await expect(billingGroup.getByRole('textbox', { name: 'City' })).toBeVisible();
		await expect(billingGroup.getByRole('textbox', { name: 'Zip Code' })).toBeVisible();

		// 5. Enter some data in billing address fields
		const streetTextbox = billingGroup.getByRole('textbox', { name: 'Street' });
		await streetTextbox.fill('Test Street');

		const cityTextbox = billingGroup.getByRole('textbox', { name: 'City' });
		await cityTextbox.fill('Test City');

		const zipCodeTextbox = billingGroup.getByRole('textbox', { name: 'Zip Code' });
		await zipCodeTextbox.fill('12345');

		// 6. Uncheck the "Add Billing Address" checkbox
		await addBillingAddressCheckbox.uncheck();

		// 7. Observe the "Billing Address" section is hidden
		await expect(billingGroup).toBeHidden();

		// 8. Check the "Add Billing Address" checkbox again
		await addBillingAddressCheckbox.check();

		// Verify: Section re-appears when checkbox is checked again
		await expect(billingGroup).toBeVisible();
	});

	test('Dynamic Form Behavior - Toggle Shipping Address', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// 2. Observe the form in initial state (shipping address section hidden)
		const shippingGroup = page.getByRole('group', { name: 'Shipping Address' });
		await expect(shippingGroup).toBeHidden();

		// 3. Check the "Add Shipping Address" checkbox
		const addShippingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });
		await addShippingAddressCheckbox.check();

		// 4. Observe the "Shipping Address" section appears
		await expect(shippingGroup).toBeVisible();

		// Verify: Fields include: Street, City, Zip Code, Note
		await expect(shippingGroup.getByRole('textbox', { name: 'Street' })).toBeVisible();
		await expect(shippingGroup.getByRole('textbox', { name: 'City' })).toBeVisible();
		await expect(shippingGroup.getByRole('textbox', { name: 'Zip Code' })).toBeVisible();
		await expect(shippingGroup.getByRole('textbox', { name: 'Note' })).toBeVisible();

		// 5. Enter some data in shipping address fields including note
		const streetTextbox = shippingGroup.getByRole('textbox', { name: 'Street' });
		await streetTextbox.fill('Test Street');

		const cityTextbox = shippingGroup.getByRole('textbox', { name: 'City' });
		await cityTextbox.fill('Test City');

		const zipCodeTextbox = shippingGroup.getByRole('textbox', { name: 'Zip Code' });
		await zipCodeTextbox.fill('54321');

		const noteTextbox = shippingGroup.getByRole('textbox', { name: 'Note' });
		await noteTextbox.fill('Test delivery note');

		// 6. Uncheck the "Add Shipping Address" checkbox
		await addShippingAddressCheckbox.uncheck();

		// 7. Observe the "Shipping Address" section is hidden
		await expect(shippingGroup).toBeHidden();

		// 8. Check the "Add Shipping Address" checkbox again
		await addShippingAddressCheckbox.check();

		// Verify: Section re-appears when checkbox is checked again
		await expect(shippingGroup).toBeVisible();

		// Verify: Note field is optional (can be left empty)
		await expect(noteTextbox).toBeVisible();
	});
});
