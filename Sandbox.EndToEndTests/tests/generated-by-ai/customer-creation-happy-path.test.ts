// spec: TEST_PLAN.md - Section 2: Customer Creation - Happy Path Scenarios
// Seed: setup/auth.setup.ts

import { test, expect } from '@playwright/test';
import { generateRandomString } from '../../utils';

test.describe('Customer Creation - Happy Path', () => {
	test('Create Customer - Minimal Information Only', { tag: '@customer-creation' }, async ({ page }) => {
	// Navigate to /customers
	await page.goto('/customers');

	// Generate unique names
	const firstName = `John${generateRandomString(6)}`;
	const lastName = `Doe${generateRandomString(6)}`;

	// Locate form elements
	const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
	const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
	const createButton = page.getByRole('button', { name: /Create Customer/i });

	await test.step('Fill in First Name and Last Name only', async () => {
		// In "First Name" textbox, type a unique first name
		await firstNameTextbox.fill(firstName);

		// In "Last Name" textbox, type a unique last name
		await lastNameTextbox.fill(lastName);

		// Verify both "Add Billing Address" and "Add Shipping Address" checkboxes are unchecked
		const billingCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
		const shippingCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });
		await expect(billingCheckbox).not.toBeChecked();
		await expect(shippingCheckbox).not.toBeChecked();
	});

	await test.step('Click "Create Customer" button', async () => {
		// Click "Create Customer" button
		await createButton.click();
	});

	await test.step('Verify customer appears in table', async () => {
		// After creation, new customer appears in the table
		const customerCell = page.getByRole('cell', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		await expect(customerCell).toBeVisible();

		// "View Details" link is visible for the new customer
		const customerRow = page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		const detailsLink = customerRow.getByRole('link', { name: /view details/i });
		await expect(detailsLink).toBeVisible();
	});

	await test.step('Verify form is reset', async () => {
		// Form is reset and cleared for next entry
		await expect(firstNameTextbox).toHaveValue('');
		await expect(lastNameTextbox).toHaveValue('');
	});
});

test('Create Customer - With Billing Address', { tag: '@customer-creation' }, async ({ page }) => {
	// Navigate to /customers
	await page.goto('/customers');

	const firstName = `Jane${generateRandomString(6)}`;
	const lastName = `Smith${generateRandomString(6)}`;

	const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
	const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
	const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });

	await test.step('Fill customer information with billing address', async () => {
		// In "First Name" textbox, type "Jane{randomString}"
		await firstNameTextbox.fill(firstName);

		// In "Last Name" textbox, type "Smith{randomString}"
		await lastNameTextbox.fill(lastName);

		// Check "Add Billing Address" checkbox
		await addBillingAddressCheckbox.check();

		// Verify billing address fieldset appears
		const billingFieldset = page.getByRole('group', { name: 'Billing Address' });
		await expect(billingFieldset).toBeVisible();

		// In billing "Street" textbox, type "123 Main Street"
		const billingStreetTextbox = billingFieldset.getByRole('textbox', { name: 'Street' });
		await billingStreetTextbox.fill('123 Main Street');

		// In billing "City" textbox, type "Springfield"
		const billingCityTextbox = billingFieldset.getByRole('textbox', { name: 'City' });
		await billingCityTextbox.fill('Springfield');

		// In billing "Zip Code" textbox, type "12345"
		const billingZipCodeTextbox = billingFieldset.getByRole('textbox', { name: 'Zip Code' });
		await billingZipCodeTextbox.fill('12345');
	});

	await test.step('Submit the form', async () => {
		// Press Enter to submit
		await page.keyboard.press('Enter');
	});

	await test.step('Verify customer is created', async () => {
		// Customer appears in the table
		const customerCell = page.getByRole('cell', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		await expect(customerCell).toBeVisible();
	});

	await test.step('Verify form is reset', async () => {
		// Form is reset including billing address fields
		await expect(firstNameTextbox).toHaveValue('');
		await expect(lastNameTextbox).toHaveValue('');

		// Billing address checkbox is unchecked after creation
		await expect(addBillingAddressCheckbox).not.toBeChecked();
	});
});

test('Create Customer - With Shipping Address (No Note)', { tag: '@customer-creation' }, async ({ page }) => {
	// Navigate to /customers
	await page.goto('/customers');

	const firstName = `Alice${generateRandomString(6)}`;
	const lastName = `Johnson${generateRandomString(6)}`;

	const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
	const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
	const addShippingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });

	await test.step('Fill customer information with shipping address', async () => {
		// In "First Name" textbox, type "Alice{randomString}"
		await firstNameTextbox.fill(firstName);

		// In "Last Name" textbox, type "Johnson{randomString}"
		await lastNameTextbox.fill(lastName);

		// Check "Add Shipping Address" checkbox
		await addShippingAddressCheckbox.check();

		// Verify shipping address fieldset appears
		const shippingFieldset = page.getByRole('group', { name: 'Shipping Address' });
		await expect(shippingFieldset).toBeVisible();

		// In shipping "Street" textbox, type "456 Oak Avenue"
		const shippingStreetTextbox = shippingFieldset.getByRole('textbox', { name: 'Street' });
		await shippingStreetTextbox.fill('456 Oak Avenue');

		// In shipping "City" textbox, type "Portland"
		const shippingCityTextbox = shippingFieldset.getByRole('textbox', { name: 'City' });
		await shippingCityTextbox.fill('Portland');

		// In shipping "Zip Code" textbox, type "97201"
		const shippingZipCodeTextbox = shippingFieldset.getByRole('textbox', { name: 'Zip Code' });
		await shippingZipCodeTextbox.fill('97201');

		// Leave "Note" textarea empty
		// (No action needed - just documenting the expected state)
	});

	await test.step('Submit the form', async () => {
		const createButton = page.getByRole('button', { name: /Create Customer/i });
		await createButton.click();
	});

	await test.step('Verify customer is created', async () => {
		// Customer appears in the table
		const customerCell = page.getByRole('cell', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		await expect(customerCell).toBeVisible();
	});

	await test.step('Verify form is reset', async () => {
		// Form is reset
		await expect(firstNameTextbox).toHaveValue('');
		await expect(lastNameTextbox).toHaveValue('');
		await expect(addShippingAddressCheckbox).not.toBeChecked();
	});
});

test('Create Customer - With Shipping Address and Note', { tag: '@customer-creation' }, async ({ page }) => {
	// Navigate to /customers
	await page.goto('/customers');

	const firstName = `Bob${generateRandomString(6)}`;
	const lastName = `Williams${generateRandomString(6)}`;

	const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
	const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
	const addShippingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });

	await test.step('Fill customer information with shipping address and note', async () => {
		// In "First Name" textbox, type "Bob{randomString}"
		await firstNameTextbox.fill(firstName);

		// In "Last Name" textbox, type "Williams{randomString}"
		await lastNameTextbox.fill(lastName);

		// Check "Add Shipping Address" checkbox
		await addShippingAddressCheckbox.check();

		const shippingFieldset = page.getByRole('group', { name: 'Shipping Address' });

		// In shipping "Street" textbox, type "789 Pine Road"
		const shippingStreetTextbox = shippingFieldset.getByRole('textbox', { name: 'Street' });
		await shippingStreetTextbox.fill('789 Pine Road');

		// In shipping "City" textbox, type "Austin"
		const shippingCityTextbox = shippingFieldset.getByRole('textbox', { name: 'City' });
		await shippingCityTextbox.fill('Austin');

		// In shipping "Zip Code" textbox, type "78701"
		const shippingZipCodeTextbox = shippingFieldset.getByRole('textbox', { name: 'Zip Code' });
		await shippingZipCodeTextbox.fill('78701');

		// In "Note" textarea, type "Please deliver after 5 PM on weekdays"
		const noteTextarea = shippingFieldset.getByRole('textbox', { name: 'Note' });
		await noteTextarea.fill('Please deliver after 5 PM on weekdays');
	});

	await test.step('Submit the form', async () => {
		const createButton = page.getByRole('button', { name: /Create Customer/i });
		await createButton.click();
	});

	await test.step('Verify customer is created', async () => {
		// Customer appears in the table
		const customerCell = page.getByRole('cell', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		await expect(customerCell).toBeVisible();
	});

	await test.step('Verify form is reset', async () => {
		// Form is reset
		await expect(firstNameTextbox).toHaveValue('');
		await expect(lastNameTextbox).toHaveValue('');
	});
});

test('Create Customer - With Both Billing and Shipping Addresses', { tag: '@customer-creation' }, async ({ page }) => {
	// Navigate to /customers
	await page.goto('/customers');

	const firstName = `Carol${generateRandomString(6)}`;
	const lastName = `Davis${generateRandomString(6)}`;

	const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
	const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
	const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
	const addShippingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });

	await test.step('Fill customer information with both addresses', async () => {
		// In "First Name" textbox, type "Carol{randomString}"
		await firstNameTextbox.fill(firstName);

		// In "Last Name" textbox, type "Davis{randomString}"
		await lastNameTextbox.fill(lastName);

		// Check "Add Billing Address" checkbox
		await addBillingAddressCheckbox.check();

		// Fill billing address
		const billingFieldset = page.getByRole('group', { name: 'Billing Address' });

		// Street: "100 Commerce Blvd"
		const billingStreetTextbox = billingFieldset.getByRole('textbox', { name: 'Street' });
		await billingStreetTextbox.fill('100 Commerce Blvd');

		// City: "Seattle"
		const billingCityTextbox = billingFieldset.getByRole('textbox', { name: 'City' });
		await billingCityTextbox.fill('Seattle');

		// Zip Code: "98101"
		const billingZipCodeTextbox = billingFieldset.getByRole('textbox', { name: 'Zip Code' });
		await billingZipCodeTextbox.fill('98101');

		// Check "Add Shipping Address" checkbox
		await addShippingAddressCheckbox.check();

		// Fill shipping address
		const shippingFieldset = page.getByRole('group', { name: 'Shipping Address' });

		// Street: "200 Residential Lane"
		const shippingStreetTextbox = shippingFieldset.getByRole('textbox', { name: 'Street' });
		await shippingStreetTextbox.fill('200 Residential Lane');

		// City: "Tacoma"
		const shippingCityTextbox = shippingFieldset.getByRole('textbox', { name: 'City' });
		await shippingCityTextbox.fill('Tacoma');

		// Zip Code: "98402"
		const shippingZipCodeTextbox = shippingFieldset.getByRole('textbox', { name: 'Zip Code' });
		await shippingZipCodeTextbox.fill('98402');

		// Note: "Leave package at front door if no answer"
		const noteTextarea = shippingFieldset.getByRole('textbox', { name: 'Note' });
		await noteTextarea.fill('Leave package at front door if no answer');
	});

	await test.step('Submit the form', async () => {
		const createButton = page.getByRole('button', { name: /Create Customer/i });
		await createButton.click();
	});

	await test.step('Verify customer is created', async () => {
		// Customer appears in the table with full name
		const customerCell = page.getByRole('cell', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		await expect(customerCell).toBeVisible();
	});

	await test.step('Verify form is completely reset', async () => {
		// Form is completely reset with both address sections hidden
		await expect(firstNameTextbox).toHaveValue('');
		await expect(lastNameTextbox).toHaveValue('');
		await expect(addBillingAddressCheckbox).not.toBeChecked();
		await expect(addShippingAddressCheckbox).not.toBeChecked();
	});
});
});
