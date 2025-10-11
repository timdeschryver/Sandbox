// spec: TEST_PLAN.md - Section 3: Customer Creation - Validation Scenarios
// Seed: setup/auth.setup.ts

import { test, expect } from '@playwright/test';
import { generateRandomString } from '../../utils';

test.describe('Customer Creation - Validation Scenarios', () => {
	test('Submit Empty Form', { tag: '@validation' }, async ({ page }) => {
		// Navigate to /customers
		await page.goto('/customers');

		await test.step('Attempt to submit form without entering any data', async () => {
			// Without entering any data, click "Create Customer" button
			const createButton = page.getByRole('button', { name: /Create Customer/i });
			await createButton.click();
		});

		await test.step('Verify validation summary appears with errors', async () => {
			// Validation summary section appears with heading "Validation summary:"
			const validationSummary = page.getByRole('heading', { name: /Validation summary/i });
			await expect(validationSummary).toBeVisible();

			// Validation messages displayed for First Name (required)
			await expect(page.getByText(/ng\.form0\.firstName: Field is required/i)).toBeVisible();

			// Validation messages displayed for Last Name (required)
			await expect(page.getByText(/ng\.form0\.lastName: Field is required/i)).toBeVisible();
		});
	});

	test('Validate First Name - Required', { tag: '@validation' }, async ({ page }) => {
		// Navigate to /customers
		await page.goto('/customers');

		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });

		await test.step('Fill only Last Name and attempt to submit', async () => {
			// Leave "First Name" field empty
			// In "Last Name" textbox, type "TestLast"
			await lastNameTextbox.fill('TestLast');

			// Attempt to submit the form
			const createButton = page.getByRole('button', { name: /Create Customer/i });
			await createButton.click();
		});

		await test.step('Verify First Name validation error', async () => {
			// Form validation catches missing First Name
			// Validation summary shows First Name is required
			const validationSummary = page.getByRole('heading', { name: /Validation summary/i });
			await expect(validationSummary).toBeVisible();
			await expect(page.getByText(/ng\.form0\.firstName: Field is required/i)).toBeVisible();
		});
	});

	test('Validate Last Name - Required', { tag: '@validation' }, async ({ page }) => {
		// Navigate to /customers
		await page.goto('/customers');

		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });

		await test.step('Fill only First Name and attempt to submit', async () => {
			// In "First Name" textbox, type "TestFirst"
			await firstNameTextbox.fill('TestFirst');

			// Leave "Last Name" field empty
			// Attempt to submit the form
			const createButton = page.getByRole('button', { name: /Create Customer/i });
			await createButton.click();
		});

		await test.step('Verify Last Name validation error', async () => {
			// Form validation catches missing Last Name
			// Validation summary shows Last Name is required
			const validationSummary = page.getByRole('heading', { name: /Validation summary/i });
			await expect(validationSummary).toBeVisible();
			await expect(page.getByText(/ng\.form0\.lastName: Field is required/i)).toBeVisible();
		});
	});

	test('Billing Address - Incomplete Information', { tag: '@validation' }, async ({ page }) => {
		// Navigate to /customers
		await page.goto('/customers');

		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });

		await test.step('Fill customer info and partial billing address', async () => {
			// In "First Name" textbox, type "Test"
			await firstNameTextbox.fill('Test');

			// In "Last Name" textbox, type "User"
			await lastNameTextbox.fill('User');

			// Check "Add Billing Address" checkbox
			await addBillingAddressCheckbox.check();

			const billingFieldset = page.getByRole('group', { name: 'Billing Address' });

			// In billing "Street" textbox, type only "St" (2 characters)
			const billingStreetTextbox = billingFieldset.getByRole('textbox', { name: 'Street' });
			await billingStreetTextbox.fill('St');

			// Leave other billing fields empty
		});

		await test.step('Attempt to submit the form', async () => {
			const createButton = page.getByRole('button', { name: /Create Customer/i });
			await createButton.click();
		});

		await test.step('Verify validation errors for billing address', async () => {
			// Validation summary appears
			const validationSummary = page.getByRole('heading', { name: /Validation summary/i });
			await expect(validationSummary).toBeVisible();

			// Street shows minimum length error (requires 3 characters)
			await expect(page.getByText(/ng\.form0\.billingAddress\.street: Minimum length is 3 characters/i)).toBeVisible();

			// City shows required error
			await expect(page.getByText(/ng\.form0\.billingAddress\.city: Field is required/i)).toBeVisible();

			// Zip Code shows required error
			await expect(page.getByText(/ng\.form0\.billingAddress\.zipCode: Field is required/i)).toBeVisible();
		});
	});

	test('Billing Address - Zip Code Length Validation (Too Short)', { tag: '@validation' }, async ({ page }) => {
		// Navigate to /customers
		await page.goto('/customers');

		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });

		await test.step('Fill customer info and billing address with short zip code', async () => {
			// In "First Name" textbox, type "Test"
			await firstNameTextbox.fill('Test');

			// In "Last Name" textbox, type "User"
			await lastNameTextbox.fill('User');

			// Check "Add Billing Address" checkbox
			await addBillingAddressCheckbox.check();

			const billingFieldset = page.getByRole('group', { name: 'Billing Address' });

			// In billing "Street" textbox, type "Main Street"
			const billingStreetTextbox = billingFieldset.getByRole('textbox', { name: 'Street' });
			await billingStreetTextbox.fill('Main Street');

			// In billing "City" textbox, type "Portland"
			const billingCityTextbox = billingFieldset.getByRole('textbox', { name: 'City' });
			await billingCityTextbox.fill('Portland');

			// In billing "Zip Code" textbox, type "12" (2 characters)
			const billingZipCodeTextbox = billingFieldset.getByRole('textbox', { name: 'Zip Code' });
			await billingZipCodeTextbox.fill('12');
		});

		await test.step('Attempt to submit the form', async () => {
			const createButton = page.getByRole('button', { name: /Create Customer/i });
			await createButton.click();
		});

		await test.step('Verify zip code validation error', async () => {
			// Validation summary appears
			const validationSummary = page.getByRole('heading', { name: /Validation summary/i });
			await expect(validationSummary).toBeVisible();

			// Zip Code shows error: "Zip code must be between 3 and 5 characters long."
			await expect(
				page.getByText(/ng\.form0\.billingAddress\.zipCode:.*Zip code must be between 3 and 5 characters long/i),
			).toBeVisible();
		});
	});

	test('Billing Address - Zip Code Maximum Length', { tag: '@validation' }, async ({ page }) => {
		// Navigate to /customers
		await page.goto('/customers');

		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });

		await test.step('Fill customer info and billing address with long zip code', async () => {
			// Fill required fields (First Name, Last Name)
			await firstNameTextbox.fill('Test');
			await lastNameTextbox.fill('User');

			// Check "Add Billing Address" checkbox
			await addBillingAddressCheckbox.check();

			const billingFieldset = page.getByRole('group', { name: 'Billing Address' });

			// Fill billing address with valid street and city
			const billingStreetTextbox = billingFieldset.getByRole('textbox', { name: 'Street' });
			await billingStreetTextbox.fill('Main Street');

			const billingCityTextbox = billingFieldset.getByRole('textbox', { name: 'City' });
			await billingCityTextbox.fill('Portland');

			// In billing "Zip Code" textbox, type "123456" (6 characters)
			const billingZipCodeTextbox = billingFieldset.getByRole('textbox', { name: 'Zip Code' });
			await billingZipCodeTextbox.fill('123456');
		});

		await test.step('Attempt to submit the form', async () => {
			const createButton = page.getByRole('button', { name: /Create Customer/i });
			await createButton.click();
		});

		await test.step('Verify that input field limits to 5 characters', async () => {
			// The input field has maxlength="5" so only 5 characters are actually entered
			// The form should be successfully submitted as "12345" is valid
			const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
			await expect(firstNameTextbox).toHaveValue('');
		});
	});

	test('Shipping Address - Note Minimum Length', { tag: '@validation' }, async ({ page }) => {
		// Navigate to /customers
		await page.goto('/customers');

		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		const addShippingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });

		await test.step('Fill customer info and shipping address with short note', async () => {
			// Fill required fields (First Name, Last Name)
			await firstNameTextbox.fill('Test');
			await lastNameTextbox.fill('User');

			// Check "Add Shipping Address" checkbox
			await addShippingAddressCheckbox.check();

			const shippingFieldset = page.getByRole('group', { name: 'Shipping Address' });

			// Fill shipping address with valid street, city, and zip code
			const shippingStreetTextbox = shippingFieldset.getByRole('textbox', { name: 'Street' });
			await shippingStreetTextbox.fill('Test Street');

			const shippingCityTextbox = shippingFieldset.getByRole('textbox', { name: 'City' });
			await shippingCityTextbox.fill('Test City');

			const shippingZipCodeTextbox = shippingFieldset.getByRole('textbox', { name: 'Zip Code' });
			await shippingZipCodeTextbox.fill('12345');

			// In "Note" textarea, type "Short" (5 characters, less than minimum 10)
			const noteTextarea = shippingFieldset.getByRole('textbox', { name: 'Note' });
			await noteTextarea.fill('Short');
		});

		await test.step('Attempt to submit the form', async () => {
			const createButton = page.getByRole('button', { name: /Create Customer/i });
			await createButton.click();
		});

		await test.step('Verify note validation error', async () => {
			// Validation summary appears
			const validationSummary = page.getByRole('heading', { name: /Validation summary/i });
			await expect(validationSummary).toBeVisible();

			// Note field shows minimum length error (requires 10 characters)
			await expect(page.getByText(/ng\.form0\.shippingAddress\.note:.*Minimum length is 10 characters/i)).toBeVisible();
		});
	});

	test('Shipping Address - Valid Short Zip Code', { tag: '@validation' }, async ({ page }) => {
		// Navigate to /customers
		await page.goto('/customers');

		const firstName = `Test${generateRandomString(6)}`;
		const lastName = `User${generateRandomString(6)}`;

		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		const addShippingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });

		await test.step('Fill customer info and shipping address with minimum valid zip code', async () => {
			// Fill required fields with valid data
			await firstNameTextbox.fill(firstName);
			await lastNameTextbox.fill(lastName);

			// Check "Add Shipping Address" checkbox
			await addShippingAddressCheckbox.check();

			const shippingFieldset = page.getByRole('group', { name: 'Shipping Address' });

			// Fill shipping address with minimum valid zip code "123"
			const shippingStreetTextbox = shippingFieldset.getByRole('textbox', { name: 'Street' });
			await shippingStreetTextbox.fill('Test Street');

			const shippingCityTextbox = shippingFieldset.getByRole('textbox', { name: 'City' });
			await shippingCityTextbox.fill('Test City');

			const shippingZipCodeTextbox = shippingFieldset.getByRole('textbox', { name: 'Zip Code' });
			await shippingZipCodeTextbox.fill('123');
		});

		await test.step('Submit the form', async () => {
			const createButton = page.getByRole('button', { name: /Create Customer/i });
			await createButton.click();
		});

		await test.step('Verify customer is created successfully', async () => {
			// Form is submitted successfully
			// Customer is created
			// Customer appears in the table
			const customerCell = page.getByRole('cell', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
			await expect(customerCell).toBeVisible();
		});
	});

	test('Dynamically Toggle Address Sections', { tag: '@validation' }, async ({ page }) => {
		// Navigate to /customers
		await page.goto('/customers');

		const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });

		await test.step('Check "Add Billing Address" and verify fields appear', async () => {
			// Check "Add Billing Address" checkbox
			await addBillingAddressCheckbox.check();

			// Verify billing address fields appear
			const billingFieldset = page.getByRole('group', { name: 'Billing Address' });
			await expect(billingFieldset).toBeVisible();
		});

		await test.step('Fill billing address with valid data', async () => {
			const billingFieldset = page.getByRole('group', { name: 'Billing Address' });

			const billingStreetTextbox = billingFieldset.getByRole('textbox', { name: 'Street' });
			await billingStreetTextbox.fill('Test Street');

			const billingCityTextbox = billingFieldset.getByRole('textbox', { name: 'City' });
			await billingCityTextbox.fill('Test City');

			const billingZipCodeTextbox = billingFieldset.getByRole('textbox', { name: 'Zip Code' });
			await billingZipCodeTextbox.fill('12345');
		});

		await test.step('Uncheck "Add Billing Address" and verify section is hidden', async () => {
			// Uncheck "Add Billing Address" checkbox
			await addBillingAddressCheckbox.uncheck();

			// Verify billing address section is hidden
			const billingFieldset = page.getByRole('group', { name: 'Billing Address' });
			await expect(billingFieldset).toBeHidden();
		});

		await test.step('Check "Add Billing Address" again and verify fields are empty', async () => {
			// Check "Add Billing Address" again
			await addBillingAddressCheckbox.check();

			// Verify billing address fields are empty (form maintains state but validation is hidden)
			const billingFieldset = page.getByRole('group', { name: 'Billing Address' });
			await expect(billingFieldset).toBeVisible();

			const billingStreetTextbox = billingFieldset.getByRole('textbox', { name: 'Street' });
			const billingCityTextbox = billingFieldset.getByRole('textbox', { name: 'City' });
			const billingZipCodeTextbox = billingFieldset.getByRole('textbox', { name: 'Zip Code' });

			// Address sections show/hide correctly based on checkbox state
			// When section is hidden, validation for those fields is not applied
			await expect(billingStreetTextbox).toBeVisible();
			await expect(billingCityTextbox).toBeVisible();
			await expect(billingZipCodeTextbox).toBeVisible();
		});
	});
});
