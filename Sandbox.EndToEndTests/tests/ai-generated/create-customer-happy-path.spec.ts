// spec: specs/test-plan.md
// seed: setup/auth.setup.ts

import { test, expect } from '@playwright/test';
import { generateRandomString } from '../../utils';

test.describe('Customer Management - Create Operations', () => {
	test('Create Customer with Only Required Fields', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// Generate unique names to prevent data conflicts
		const firstName = `John${generateRandomString(8)}`;
		const lastName = `Doe${generateRandomString(8)}`;

		// 2. Enter "John" in the "First Name" field
		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill(firstName);

		// 3. Enter "Doe" in the "Last Name" field
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill(lastName);

		// 4. Ensure "Add Billing Address" checkbox is unchecked
		const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
		await expect(addBillingAddressCheckbox).not.toBeChecked();

		// 5. Ensure "Add Shipping Address" checkbox is unchecked
		const addShippingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });
		await expect(addShippingAddressCheckbox).not.toBeChecked();

		// 6. Click the "Create Customer" button
		await page.getByRole('button', { name: 'Create Customer' }).click();

		// Verify: Customer is created successfully
		// Verify: New customer appears in the customers table
		const customerCell = page.getByRole('cell', { name: `${firstName} ${lastName}`, exact: true });
		await expect(customerCell).toBeVisible();

		// Verify: Form is cleared and reset to initial state
		await expect(firstNameTextbox).toHaveValue('');
		await expect(lastNameTextbox).toHaveValue('');
	});

	test('Create Customer with Billing Address', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// Generate unique names to prevent data conflicts
		const firstName = `Jane${generateRandomString(8)}`;
		const lastName = `Smith${generateRandomString(8)}`;

		// 2. In the "Create Customer" form: Enter "Jane" in the "First Name" field
		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill(firstName);

		// Enter "Smith" in the "Last Name" field
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill(lastName);

		// 3. Check the "Add Billing Address" checkbox
		const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
		await addBillingAddressCheckbox.check();

		// 4. Verify "Billing Address" section becomes visible
		const billingGroup = page.getByRole('group', { name: 'Billing Address' });
		await expect(billingGroup).toBeVisible();

		// 5. In the "Billing Address" section: Enter "123 Main Street" in the "Street" field
		const streetTextbox = billingGroup.getByRole('textbox', { name: 'Street' });
		await streetTextbox.fill('123 Main Street');

		// Enter "Springfield" in the "City" field
		const cityTextbox = billingGroup.getByRole('textbox', { name: 'City' });
		await cityTextbox.fill('Springfield');

		// Enter "12345" in the "Zip Code" field
		const zipCodeTextbox = billingGroup.getByRole('textbox', { name: 'Zip Code' });
		await zipCodeTextbox.fill('12345');

		// 6. Click the "Create Customer" button
		await page.getByRole('button', { name: 'Create Customer' }).click();

		// Verify: Customer is created successfully with billing address
		// Verify: Customer appears in the customers table
		const customerRow = page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		await expect(customerRow).toBeVisible();

		// Verify: Form is cleared after submission
		await expect(firstNameTextbox).toHaveValue('');
		await expect(lastNameTextbox).toHaveValue('');
		await expect(addBillingAddressCheckbox).not.toBeChecked();
	});

	test('Create Customer with Shipping Address', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// Generate unique names to prevent data conflicts
		const firstName = `Robert${generateRandomString(8)}`;
		const lastName = `Brown${generateRandomString(8)}`;

		// 2. In the "Create Customer" form: Enter "Robert" in the "First Name" field
		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill(firstName);

		// Enter "Brown" in the "Last Name" field
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill(lastName);

		// 3. Check the "Add Shipping Address" checkbox
		const addShippingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });
		await addShippingAddressCheckbox.check();

		// 4. Verify "Shipping Address" section becomes visible
		const shippingGroup = page.getByRole('group', { name: 'Shipping Address' });
		await expect(shippingGroup).toBeVisible();

		// 5. In the "Shipping Address" section: Enter "456 Oak Avenue" in the "Street" field
		const streetTextbox = shippingGroup.getByRole('textbox', { name: 'Street' });
		await streetTextbox.fill('456 Oak Avenue');

		// Enter "Riverside" in the "City" field
		const cityTextbox = shippingGroup.getByRole('textbox', { name: 'City' });
		await cityTextbox.fill('Riverside');

		// Enter "54321" in the "Zip Code" field
		const zipCodeTextbox = shippingGroup.getByRole('textbox', { name: 'Zip Code' });
		await zipCodeTextbox.fill('54321');

		// Enter "Leave at front door" in the "Note" field
		const noteTextbox = shippingGroup.getByRole('textbox', { name: 'Note' });
		await noteTextbox.fill('Leave at front door');

		// 6. Click the "Create Customer" button
		await page.getByRole('button', { name: 'Create Customer' }).click();

		// Verify: Customer is created successfully with shipping address
		// Verify: Customer appears in the customers table
		const customerRow = page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		await expect(customerRow).toBeVisible();

		// Verify: Form is cleared after submission
		await expect(firstNameTextbox).toHaveValue('');
		await expect(lastNameTextbox).toHaveValue('');
		await expect(addShippingAddressCheckbox).not.toBeChecked();
	});

	test('Create Customer with Both Billing and Shipping Addresses', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// Generate unique names to prevent data conflicts
		const firstName = `Emily${generateRandomString(8)}`;
		const lastName = `Johnson${generateRandomString(8)}`;

		// 2. In the "Create Customer" form: Enter "Emily" in the "First Name" field
		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill(firstName);

		// Enter "Johnson" in the "Last Name" field
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill(lastName);

		// 3. Check the "Add Billing Address" checkbox
		const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
		await addBillingAddressCheckbox.check();

		// 4. In the "Billing Address" section: Enter "789 Elm Street" in the "Street" field
		const billingGroup = page.getByRole('group', { name: 'Billing Address' });
		const billingStreetTextbox = billingGroup.getByRole('textbox', { name: 'Street' });
		await billingStreetTextbox.fill('789 Elm Street');

		// Enter "Portland" in the "City" field
		const billingCityTextbox = billingGroup.getByRole('textbox', { name: 'City' });
		await billingCityTextbox.fill('Portland');

		// Enter "97201" in the "Zip Code" field
		const billingZipCodeTextbox = billingGroup.getByRole('textbox', { name: 'Zip Code' });
		await billingZipCodeTextbox.fill('97201');

		// 5. Check the "Add Shipping Address" checkbox
		const addShippingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });
		await addShippingAddressCheckbox.check();

		// 6. In the "Shipping Address" section: Enter "321 Pine Road" in the "Street" field
		const shippingGroup = page.getByRole('group', { name: 'Shipping Address' });
		const shippingStreetTextbox = shippingGroup.getByRole('textbox', { name: 'Street' });
		await shippingStreetTextbox.fill('321 Pine Road');

		// Enter "Seattle" in the "City" field
		const shippingCityTextbox = shippingGroup.getByRole('textbox', { name: 'City' });
		await shippingCityTextbox.fill('Seattle');

		// Enter "98101" in the "Zip Code" field
		const shippingZipCodeTextbox = shippingGroup.getByRole('textbox', { name: 'Zip Code' });
		await shippingZipCodeTextbox.fill('98101');

		// Enter "Delivery between 9-5 PM only" in the "Note" field
		const noteTextbox = shippingGroup.getByRole('textbox', { name: 'Note' });
		await noteTextbox.fill('Delivery between 9-5 PM only');

		// 7. Click the "Create Customer" button
		await page.getByRole('button', { name: 'Create Customer' }).click();

		// Verify: Customer is created successfully with both addresses
		// Verify: Customer appears in the customers table
		const customerRow = page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		await expect(customerRow).toBeVisible();

		// Verify: Form is cleared after submission
		await expect(firstNameTextbox).toHaveValue('');
		await expect(lastNameTextbox).toHaveValue('');
		await expect(addBillingAddressCheckbox).not.toBeChecked();
		await expect(addShippingAddressCheckbox).not.toBeChecked();
	});
});
