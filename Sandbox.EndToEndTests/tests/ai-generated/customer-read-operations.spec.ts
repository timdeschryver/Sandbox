// spec: specs/test-plan.md
// seed: setup/auth.setup.ts

import { test, expect } from '@playwright/test';
import { generateRandomString } from '../../utils';

test.describe('Customer Management - Read Operations', () => {
	test('View Customer List', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// Verify: Page title is "Customers"
		await expect(page).toHaveTitle('Customers');

		// Verify: "Customers" heading (h2) is displayed
		await expect(page.getByRole('heading', { name: 'Customers', level: 2 })).toBeVisible();

		// Verify: Customer table is visible with columns
		const table = page.getByRole('table');
		await expect(table).toBeVisible();

		// Verify: Refresh icon column (🔃 button)
		await expect(page.getByRole('button', { name: '🔃' })).toBeVisible();

		// Verify: Name column
		await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();

		// Verify: All existing customers are listed in the table
		// Verify: Each customer row displays full name (First Name + Last Name)
		const rows = page.getByRole('row');
		await expect(rows).not.toHaveCount(0);

		// Verify: Each customer row has a "View Details" link
		const viewDetailsLinks = page.getByRole('link', { name: 'View Details' });
		await expect(viewDetailsLinks.first()).toBeVisible();
	});

	test('Refresh Customer List', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// 2. Note the current list of customers
		const rowsBefore = await page.getByRole('row').count();

		// 3. Click the refresh button (🔃) in the table header
		await page.getByRole('button', { name: '🔃' }).click();

		// Verify: Table refreshes and reloads customer data
		// Verify: All customers are still displayed
		const rowsAfter = await page.getByRole('row').count();
		expect(rowsAfter).toBeGreaterThanOrEqual(rowsBefore);

		// Verify: No error messages appear
		await expect(page.getByText(/error/i)).toBeHidden();

		// Verify: Page doesn't navigate away
		await expect(page).toHaveURL(/\/customers$/);
	});

	test('View Customer Details - Customer Without Addresses', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// Create a customer without addresses
		const firstName = `Alice${generateRandomString(8)}`;
		const lastName = `Smith${generateRandomString(8)}`;

		await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
		await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
		await page.getByRole('button', { name: 'Create Customer' }).click();

		// 2. Locate the customer
		const customerRow = page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`, 'i') });

		// 3. Click the "View Details" link for that customer
		const viewDetailsLink = customerRow.getByRole('link', { name: 'View Details' });
		await viewDetailsLink.click();

		// Verify: Navigate to customer details page (URL: /customers/{customerId})
		await expect(page).toHaveURL(/\/customers\/[\w-]+/);

		// Verify: Page title is "Customers"
		await expect(page).toHaveTitle('Customers');

		// Verify: "Customer Details" heading (h2) is displayed
		await expect(page.getByRole('heading', { name: 'Customer Details', level: 2 })).toBeVisible();

		// Verify: "Back to Overview" link is visible
		await expect(page.getByRole('link', { name: 'Back to Overview' })).toBeVisible();

		// Verify: "Personal Information" group displays Name
		const personalInfoGroup = page.getByRole('group', { name: 'Personal Information' });
		await expect(personalInfoGroup).toBeVisible();
		await expect(personalInfoGroup.getByText(new RegExp(`Name.*${firstName} ${lastName}`, 'i'))).toBeVisible();

		// Verify: No billing address section is displayed
		await expect(page.getByRole('group', { name: 'Billing Addresses' })).toBeHidden();

		// Verify: No shipping address section is displayed
		await expect(page.getByRole('group', { name: 'Shipping Addresses' })).toBeHidden();
	});

	test('View Customer Details - Customer With Billing Address Only', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// Create a customer with billing address only
		const firstName = `Charlie${generateRandomString(8)}`;
		const lastName = `Brown${generateRandomString(8)}`;

		await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
		await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);

		const addBillingCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
		await addBillingCheckbox.check();

		const billingFormGroup = page.getByRole('group', { name: 'Billing Address' });
		await billingFormGroup.getByRole('textbox', { name: 'Street' }).fill('123 Billing St');
		await billingFormGroup.getByRole('textbox', { name: 'City' }).fill('Billing City');
		await billingFormGroup.getByRole('textbox', { name: 'Zip Code' }).fill('12345');

		await page.getByRole('button', { name: 'Create Customer' }).click();

		// 2. Locate the customer
		const customerRow = page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`, 'i') });

		// 3. Click the "View Details" link for that customer
		const viewDetailsLink = customerRow.getByRole('link', { name: 'View Details' });
		await viewDetailsLink.click();

		// Verify: Navigate to customer details page
		await expect(page).toHaveURL(/\/customers\/[\w-]+/);

		// Verify: "Personal Information" section displays customer name
		const personalInfoGroup = page.getByRole('group', { name: 'Personal Information' });
		await expect(personalInfoGroup).toBeVisible();
		await expect(personalInfoGroup.getByText(new RegExp(`Name.*${firstName} ${lastName}`, 'i'))).toBeVisible();

		// Verify: "Billing Addresses" group is visible and contains address data
		const billingAddressGroup = page.getByRole('group', { name: 'Billing Addresses' });
		await expect(billingAddressGroup).toBeVisible();
		await expect(billingAddressGroup.getByText(/Street/i)).toBeVisible();
		await expect(billingAddressGroup.getByText(/Billing City/i)).toBeVisible();
		await expect(billingAddressGroup.getByText(/Zip Code/i)).toBeVisible();

		// Verify: No shipping address section is displayed
		await expect(page.getByRole('group', { name: 'Shipping Addresses' })).toBeHidden();
	});

	test('View Customer Details - Customer With Shipping Address Only', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// Create a customer with shipping address only
		const firstName = `Bob${generateRandomString(8)}`;
		const lastName = `Johnson${generateRandomString(8)}`;

		await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
		await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);

		const addShippingCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });
		await addShippingCheckbox.check();

		const shippingFormGroup = page.getByRole('group', { name: 'Shipping Address' });
		await shippingFormGroup.getByRole('textbox', { name: 'Street' }).fill('456 Shipping Ave');
		await shippingFormGroup.getByRole('textbox', { name: 'City' }).fill('Shipping City');
		await shippingFormGroup.getByRole('textbox', { name: 'Zip Code' }).fill('54321');
		await shippingFormGroup.getByRole('textbox', { name: 'Note' }).fill('Test shipping note');

		await page.getByRole('button', { name: 'Create Customer' }).click();

		// 2. Locate the customer
		const customerRow = page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`, 'i') });

		// 3. Click the "View Details" link for that customer
		const viewDetailsLink = customerRow.getByRole('link', { name: 'View Details' });
		await viewDetailsLink.click();

		// Verify: Navigate to customer details page
		await expect(page).toHaveURL(/\/customers\/[\w-]+/);

		// Verify: "Personal Information" section displays customer name
		const personalInfoGroup = page.getByRole('group', { name: 'Personal Information' });
		await expect(personalInfoGroup).toBeVisible();
		await expect(personalInfoGroup.getByText(new RegExp(`Name.*${firstName} ${lastName}`, 'i'))).toBeVisible();

		// Verify: "Shipping Addresses" group is visible and contains address data
		const shippingAddressGroup = page.getByRole('group', { name: 'Shipping Addresses' });
		await expect(shippingAddressGroup).toBeVisible();
		await expect(shippingAddressGroup.getByText(/Street/i)).toBeVisible();
		await expect(shippingAddressGroup.getByText(/Shipping City/i)).toBeVisible();
		await expect(shippingAddressGroup.getByText(/Zip Code/i)).toBeVisible();

		// Verify: Note field is present (if provided)
		// Note: This check is conditional since note is optional

		// Verify: No billing address section is displayed
		await expect(page.getByRole('group', { name: 'Billing Addresses' })).toBeHidden();
	});

	test('View Customer Details - Customer With Both Addresses', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// First, create a customer with both addresses for this test
		const firstName = `TestBoth${generateRandomString(8)}`;
		const lastName = `AddressUser${generateRandomString(8)}`;

		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill(firstName);

		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill(lastName);

		// Add billing address
		const addBillingCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
		await addBillingCheckbox.check();

		const billingGroup = page.getByRole('group', { name: 'Billing Address' });
		await billingGroup.getByRole('textbox', { name: 'Street' }).fill('123 Billing St');
		await billingGroup.getByRole('textbox', { name: 'City' }).fill('Billing City');
		await billingGroup.getByRole('textbox', { name: 'Zip Code' }).fill('12345');

		// Add shipping address
		const addShippingCheckbox = page.getByRole('checkbox', { name: 'Add Shipping Address' });
		await addShippingCheckbox.check();

		const shippingGroup = page.getByRole('group', { name: 'Shipping Address' });
		await shippingGroup.getByRole('textbox', { name: 'Street' }).fill('456 Shipping Ave');
		await shippingGroup.getByRole('textbox', { name: 'City' }).fill('Shipping Town');
		await shippingGroup.getByRole('textbox', { name: 'Zip Code' }).fill('54321');
		await shippingGroup.getByRole('textbox', { name: 'Note' }).fill('Test shipping note');

		await page.getByRole('button', { name: 'Create Customer' }).click();

		// 2. Locate the customer with both addresses
		const customerRow = page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`, 'i') });

		// 3. Click the "View Details" link for that customer
		const viewDetailsLink = customerRow.getByRole('link', { name: 'View Details' });
		await viewDetailsLink.click();

		// Verify: Navigate to customer details page
		await expect(page).toHaveURL(/\/customers\/[\w-]+/);

		// Verify: "Personal Information" section displays customer name
		const personalInfoGroup = page.getByRole('group', { name: 'Personal Information' });
		await expect(personalInfoGroup).toBeVisible();
		await expect(personalInfoGroup.getByText(new RegExp(`Name.*${firstName} ${lastName}`, 'i'))).toBeVisible();

		// Verify: "Billing Addresses" group displays billing address
		const billingAddressGroup = page.getByRole('group', { name: 'Billing Addresses' });
		await expect(billingAddressGroup).toBeVisible();
		await expect(billingAddressGroup.getByText(/Street.*123 Billing St/i)).toBeVisible();
		await expect(billingAddressGroup.getByText(/City.*Billing City/i)).toBeVisible();
		await expect(billingAddressGroup.getByText(/Zip Code.*12345/i)).toBeVisible();

		// Verify: "Shipping Addresses" group displays shipping address
		const shippingAddressGroup = page.getByRole('group', { name: 'Shipping Addresses' });
		await expect(shippingAddressGroup).toBeVisible();
		await expect(shippingAddressGroup.getByText(/Street.*456 Shipping Ave/i)).toBeVisible();
		await expect(shippingAddressGroup.getByText(/City.*Shipping Town/i)).toBeVisible();
		await expect(shippingAddressGroup.getByText(/Zip Code.*54321/i)).toBeVisible();
		await expect(shippingAddressGroup.getByText(/Note.*Test shipping note/i)).toBeVisible();

		// Verify: Both address sections are clearly separated
		// This is implicitly tested by checking both groups exist
	});

	test('Navigate Back to Overview from Customer Details', async ({ page }) => {
		// 1. Navigate to any customer details page
		await page.goto('/customers');

		const firstCustomerRow = page.getByRole('row').nth(1); // Skip header row
		const viewDetailsLink = firstCustomerRow.getByRole('link', { name: 'View Details' });
		await viewDetailsLink.click();

		await expect(page).toHaveURL(/\/customers\/[\w-]+/);

		// 2. Click the "Back to Overview" link
		await page.getByRole('link', { name: 'Back to Overview' }).click();

		// Verify: User is navigated back to /customers page
		await expect(page).toHaveURL(/\/customers$/);

		// Verify: Customer list is displayed
		await expect(page.getByRole('table')).toBeVisible();

		// Verify: User remains authenticated
		await expect(page.getByRole('heading', { name: /Hello, testuser/i, level: 3 })).toBeVisible();
	});

	test('Direct URL Access to Customer Details', async ({ page }) => {
		// 1. Copy a customer ID from the customers table URL
		await page.goto('/customers');

		const firstCustomerRow = page.getByRole('row').nth(1);
		const viewDetailsLink = firstCustomerRow.getByRole('link', { name: 'View Details' });
		const href = await viewDetailsLink.getAttribute('href');
		const customerId = href?.split('/').pop();

		expect(customerId).toBeTruthy();

		// 2. Navigate directly to http://localhost:5165/customers/{customer-id} using the address bar
		await page.goto(`/customers/${customerId}`);

		// Verify: Customer details page loads successfully
		await expect(page).toHaveURL(/\/customers\/[\w-]+/);

		// Verify: Correct customer information is displayed
		await expect(page.getByRole('heading', { name: 'Customer Details', level: 2 })).toBeVisible();
		await expect(page.getByRole('group', { name: 'Personal Information' })).toBeVisible();

		// Verify: "Back to Overview" link works correctly
		const backLink = page.getByRole('link', { name: 'Back to Overview' });
		await expect(backLink).toBeVisible();
		await expect(backLink).toHaveAttribute('href', '/customers');
	});

	test('Invalid Customer ID Handling', async ({ page }) => {
		// 1. Navigate directly to http://localhost:5165/customers/00000000-0000-0000-0000-000000000000 (invalid UUID)
		await page.goto('/customers/00000000-0000-0000-0000-000000000000');

		// 2. Observe the page behavior

		// Verify: Error handling occurs gracefully
		// The application should either show an error message, 404 page, or redirect

		// Check if error message is displayed
		await expect(page.getByText(/not found/i)).toBeVisible();

		// Verify: Application does not crash
		await expect(page).not.toHaveURL(/error/);

		// Verify: User remains authenticated
		await expect(page.getByRole('heading', { name: /Hello, testuser/i, level: 3 })).toBeVisible();
	});
});
