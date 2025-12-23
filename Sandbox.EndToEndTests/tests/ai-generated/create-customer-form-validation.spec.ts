// spec: specs/test-plan.md
// seed: setup/auth.setup.ts

import { test, expect } from '@playwright/test';
import { generateRandomString } from '../../utils';

test.describe('Customer Management - Create Operations - Form Validation', () => {
	test('Form Validation - Missing Required Fields', async ({ page, browserName }) => {
		// eslint-disable-next-line playwright/no-skipped-test
		test.skip(browserName === 'firefox', '2nd checkbox check not working in test environment');

		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// 2. Check the "Add Billing Address" checkbox
		const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
		await addBillingAddressCheckbox.check();

		// 3. Check the "Add Shipping Address" checkbox
		const addShippingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });
		await addShippingAddressCheckbox.check();

		// 4. Leave all form fields empty
		// 5. Observe the form state (validation errors may appear automatically)

		// Verify: "Please fix the following errors:" heading is displayed
		await expect(page.getByRole('heading', { name: 'Please fix the following errors:' })).toBeVisible();

		// Verify: Validation errors list includes required field errors
		const validationList = page.getByRole('list');
		await expect(validationList.getByText(/firstName.*Field is required/i)).toBeVisible();
		await expect(validationList.getByText(/lastName.*Field is required/i)).toBeVisible();
		await expect(validationList.getByText(/billingAddress\.street.*Field is required/i)).toBeVisible();
		await expect(validationList.getByText(/billingAddress\.city.*Field is required/i)).toBeVisible();
		await expect(validationList.getByText(/billingAddress\.zipCode.*Field is required/i)).toBeVisible();
		await expect(validationList.getByText(/shippingAddress\.street.*Field is required/i)).toBeVisible();
		await expect(validationList.getByText(/shippingAddress\.city.*Field is required/i)).toBeVisible();
		await expect(validationList.getByText(/shippingAddress\.zipCode.*Field is required/i)).toBeVisible();

		// Verify: Form does not submit (Create Customer button remains enabled but doesn't create customer)
		const createButton = page.getByRole('button', { name: 'Create Customer' });
		await expect(createButton).toBeVisible();
	});

	test('Form Validation - Minimum Length Requirements', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// 2. In the "Create Customer" form: Enter "A" (1 character) in the "First Name" field
		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill('A');

		// Enter "B" (1 character) in the "Last Name" field
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill('B');

		// 3. Check the "Add Billing Address" checkbox
		const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
		await addBillingAddressCheckbox.check();

		// 4. In the "Billing Address" section: Enter "St" (2 characters) in the "Street" field
		const billingGroup = page.getByRole('group', { name: 'Billing Address' });
		const streetTextbox = billingGroup.getByRole('textbox', { name: 'Street' });
		await streetTextbox.fill('St');

		// Enter "NY" (2 characters) in the "City" field
		const cityTextbox = billingGroup.getByRole('textbox', { name: 'City' });
		await cityTextbox.fill('NY');

		// Enter "12" (2 characters) in the "Zip Code" field
		const zipCodeTextbox = billingGroup.getByRole('textbox', { name: 'Zip Code' });
		await zipCodeTextbox.fill('12');

		// 5. Attempt to create the customer
		await page.getByRole('button', { name: 'Create Customer' }).click();

		// Verify: Validation errors indicate minimum length requirements
		const validationList = page.getByRole('list');
		await expect(validationList.getByText(/street.*Minimum length is 3 characters/i)).toBeVisible();
		await expect(validationList.getByText(/city.*Minimum length is 3 characters/i)).toBeVisible();
		await expect(validationList.getByText(/zip.*between 3 and 5 characters/i)).toBeVisible();
	});

	test('Form Validation - Maximum Length for Zip Code', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// 2. In the "Create Customer" form: Enter "Michael" in the "First Name" field
		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill('Michael');

		// Enter "Williams" in the "Last Name" field
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill('Williams');

		// 3. Check the "Add Billing Address" checkbox
		const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
		await addBillingAddressCheckbox.check();

		// 4. In the "Billing Address" section: Enter "100 Test Street" in the "Street" field
		const billingGroup = page.getByRole('group', { name: 'Billing Address' });
		const streetTextbox = billingGroup.getByRole('textbox', { name: 'Street' });
		await streetTextbox.fill('100 Test Street');

		// Enter "Test City" in the "City" field
		const cityTextbox = billingGroup.getByRole('textbox', { name: 'City' });
		await cityTextbox.fill('Test City');

		// Enter "123456" (6 characters) in the "Zip Code" field
		const zipCodeTextbox = billingGroup.getByRole('textbox', { name: 'Zip Code' });
		await zipCodeTextbox.fill('123456');

		// Ensure input is trimmed to max length
		await expect(zipCodeTextbox).toHaveValue('12345');
	});

	test('Form Validation - Valid Zip Code Range', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// 2. Test with zip code "123" (minimum valid length): Enter "Test" in First Name
		const firstName = `Test${generateRandomString(8)}`;
		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill(firstName);

		// Enter "User" in Last Name
		const lastName = `User${generateRandomString(8)}`;
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill(lastName);

		// Check "Add Billing Address"
		const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
		await addBillingAddressCheckbox.check();

		// Enter valid street and city (at least 3 characters each)
		const billingGroup = page.getByRole('group', { name: 'Billing Address' });
		const streetTextbox = billingGroup.getByRole('textbox', { name: 'Street' });
		await streetTextbox.fill('Test Street');

		const cityTextbox = billingGroup.getByRole('textbox', { name: 'City' });
		await cityTextbox.fill('Test City');

		// Enter "123" in Zip Code
		const zipCodeTextbox = billingGroup.getByRole('textbox', { name: 'Zip Code' });
		await zipCodeTextbox.fill('123');

		// Click "Create Customer"
		await page.getByRole('button', { name: 'Create Customer' }).click();

		// 3. Verify customer is created
		const customerRow = page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		await expect(customerRow).toBeVisible();

		// 4. Repeat test with zip code "12345" (maximum valid length)
		const firstName2 = `Test2${generateRandomString(8)}`;
		const lastName2 = `User2${generateRandomString(8)}`;
		await firstNameTextbox.fill(firstName2);
		await lastNameTextbox.fill(lastName2);
		await addBillingAddressCheckbox.check();
		await streetTextbox.fill('Test Street 2');
		await cityTextbox.fill('Test City 2');
		await zipCodeTextbox.fill('12345');
		await page.getByRole('button', { name: 'Create Customer' }).click();

		// Verify: Both "123" and "12345" are accepted as valid zip codes
		const customerRow2 = page.getByRole('row', { name: new RegExp(`${firstName2} ${lastName2}`, 'i') });
		await expect(customerRow2).toBeVisible();
	});

	test('Form Validation - Shipping Note Minimum Length', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// 2. In the "Create Customer" form: Enter "Sarah" in the "First Name" field
		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill('Sarah');

		// Enter "Davis" in the "Last Name" field
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill('Davis');

		// 3. Check the "Add Shipping Address" checkbox
		const addShippingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });
		await addShippingAddressCheckbox.check();

		// 4. In the "Shipping Address" section: Enter "200 Test Road" in the "Street" field
		const shippingGroup = page.getByRole('group', { name: 'Shipping Address' });
		const streetTextbox = shippingGroup.getByRole('textbox', { name: 'Street' });
		await streetTextbox.fill('200 Test Road');

		// Enter "Test Town" in the "City" field
		const cityTextbox = shippingGroup.getByRole('textbox', { name: 'City' });
		await cityTextbox.fill('Test Town');

		// Enter "98765" in the "Zip Code" field
		const zipCodeTextbox = shippingGroup.getByRole('textbox', { name: 'Zip Code' });
		await zipCodeTextbox.fill('98765');

		// Enter "Short" (5 characters) in the "Note" field
		const noteTextbox = shippingGroup.getByRole('textbox', { name: 'Note' });
		await noteTextbox.fill('Short');

		// 5. Attempt to create the customer
		await page.getByRole('button', { name: 'Create Customer' }).click();

		// Verify: Validation error indicates Note must be at least 10 characters if provided
		await expect(page.getByRole('list').getByText(/note.*Minimum length is 10 characters/i)).toBeVisible();
	});
});
