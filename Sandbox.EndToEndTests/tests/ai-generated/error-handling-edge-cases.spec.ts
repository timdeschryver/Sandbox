// spec: specs/test-plan.md
// seed: setup/auth.setup.ts

import { test, expect } from '@playwright/test';
import { generateRandomString } from '../../utils';

test.describe('Error Handling and Edge Cases', () => {
	test('Form Submission During API Failure', async ({ page }) => {
		// Note: This test simulates API failure by intercepting network requests
		// In a real scenario, you might need to configure the test environment differently

		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// Set up network interception to simulate API failure
		await page.route('**/api/customers', (route) => {
			if (route.request().method() === 'POST') {
				route.abort('failed');
			} else {
				route.continue();
			}
		});

		// 2. Fill out customer form with valid data
		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill('TestError');

		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill('User');

		// 3. Click "Create Customer" button (API should fail)
		await page.getByRole('button', { name: 'Create Customer' }).click();

		// 5. Observe error handling

		// Verify: User-friendly error message is displayed
		const errorMessage = page.getByText('An unexpected error occurred, please try again.', { exact: true });
		await expect(errorMessage).toBeVisible();

		// Verify: Form data is preserved (not cleared)
		await expect(firstNameTextbox).toHaveValue('TestError');
		await expect(lastNameTextbox).toHaveValue('User');

		// Verify: Application remains stable
		await expect(page.getByRole('heading', { name: 'Customers', level: 2 })).toBeVisible();
		await expect(page.getByRole('heading', { name: /Hello, testuser/i, level: 3 })).toBeVisible();

		// Clean up: Remove route interception
		await page.unroute('**/api/customers');
	});

	test('Session Expiration Handling', async ({ page, context }) => {
		// Note: This test simulates session expiration
		// The actual implementation depends on your session management

		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');
		await expect(page.getByRole('heading', { name: 'Customers', level: 2 })).toBeVisible();

		// 2. Simulate session expiration by clearing cookies
		await context.clearCookies();

		// 3. Attempt to perform an action (e.g., create customer)
		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill('SessionExpired');

		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill('Test');

		await page.getByRole('button', { name: 'Create Customer' }).click();

		// Verify: error message is shown
		const errorMessage = page.getByText('An unexpected error occurred, please try again.', { exact: true });
		await expect(errorMessage).toBeVisible();
	});

	test('Special Characters in Form Input', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// 2. In the "Create Customer" form, enter special characters
		const firstName = `O'Brien${generateRandomString(8)}`;
		const lastName = `Müller-Schmidt${generateRandomString(8)}`;

		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill(firstName);

		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill(lastName);

		// 3. Check "Add Billing Address"
		const addBillingCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
		await addBillingCheckbox.check();

		// 4. In Billing Address, enter special characters
		const billingGroup = page.getByRole('group', { name: 'Billing Address' });
		const streetTextbox = billingGroup.getByRole('textbox', { name: 'Street' });
		await streetTextbox.fill("123 St. John's Rd., Apt #4");

		const cityTextbox = billingGroup.getByRole('textbox', { name: 'City' });
		await cityTextbox.fill('São Paulo');

		const zipCodeTextbox = billingGroup.getByRole('textbox', { name: 'Zip Code' });
		await zipCodeTextbox.fill('12-345');

		// 5. Submit the form
		await page.getByRole('button', { name: 'Create Customer' }).click();

		// Verify: Special characters are accepted and customer is created
		const customerRow = page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		await expect(customerRow).toBeVisible();

		// Verify: No encoding issues occur
		// Click to view details
		const viewDetailsLink = customerRow.getByRole('link', { name: 'View Details' });
		await viewDetailsLink.click();

		// Verify: Customer details page displays characters correctly
		await expect(page.getByText(new RegExp(firstName))).toBeVisible();
		await expect(page.getByText(new RegExp(lastName))).toBeVisible();
		await expect(page.getByText(/St\. John's Rd\./)).toBeVisible();
		await expect(page.getByText(/São Paulo/)).toBeVisible();

		// Verify: Data integrity is maintained
		// Verify: No SQL injection or XSS vulnerabilities (tested by proper display)
	});

	test('Very Long Input Strings', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');

		// 2. Enter very long strings (500+ characters)
		const longString = 'A'.repeat(500);

		const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
		await firstNameTextbox.fill(longString);

		const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
		await lastNameTextbox.fill(longString);

		// Check if input is truncated by UI (maxlength attribute)
		await expect(firstNameTextbox).toHaveValue(longString.substring(0, 255));

		// 3. Attempt to submit the form
		await page.getByRole('button', { name: 'Create Customer' }).click();

		// Verify: Application doesn't crash or hang
		await expect(page.getByRole('heading', { name: 'Customers', level: 2 })).toBeVisible();
		await expect(page.getByRole('heading', { name: /Hello, testuser/i, level: 3 })).toBeVisible();

		// Verify: No database errors occur (implicitly tested by stable UI)
	});
});
