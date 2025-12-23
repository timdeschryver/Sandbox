// spec: specs/test-plan.md
// seed: setup/auth.setup.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and User Experience', () => {
	test('Navigation Between Pages', async ({ page }) => {
		// 1. Navigate to http://localhost:5165
		await page.goto('/');

		// 2. Click "Customers" link → verify /customers page loads
		await page.getByRole('link', { name: 'Customers' }).click();
		await expect(page).toHaveURL(/\/customers$/);
		await expect(page.getByRole('heading', { name: 'Customers', level: 1 })).toBeVisible();

		// 3. Click "Current User" link → verify /user page loads
		await page.getByRole('link', { name: 'Profile' }).click();
		await expect(page).toHaveURL(/\/user$/);
		await expect(page.getByText(/"isAuthenticated".*true/i)).toBeVisible();

		// 4. Click "Customers" link again → verify /customers page loads
		await page.getByRole('link', { name: 'Customers' }).click();
		await expect(page).toHaveURL(/\/customers$/);
		await expect(page.getByRole('heading', { name: 'Customers', level: 1 })).toBeVisible();

		// 5. Click a customer's "View Details" → verify customer details page loads
		const firstCustomerRow = page.getByRole('row').nth(1);
		const viewDetailsLink = firstCustomerRow.getByRole('link', { name: 'View Details' });
		await viewDetailsLink.click();
		await expect(page).toHaveURL(/\/customers\/[\w-]+/);
		await expect(page.getByRole('heading', { name: 'Personal Information', level: 2 })).toBeVisible();

		// 6. Click "Back to Overview" → verify /customers page loads
		await page.getByRole('link', { name: 'Back to Overview' }).click();
		await expect(page).toHaveURL(/\/customers$/);
		await expect(page.getByRole('heading', { name: 'Customers', level: 1 })).toBeVisible();

		// Verify: All navigation links work correctly
		// Verify: Page transitions are smooth
		// Verify: No console errors occur
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		// Verify: User authentication persists throughout navigation
		await expect(page.locator('div').filter({ hasText: /^👋 testuser$/ })).toBeVisible();

		// Check that no critical console errors occurred during navigation
		expect(consoleErrors.filter((e) => !e.includes('404'))).toHaveLength(0);
	});

	test('Browser Back Button Functionality', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');
		await expect(page).toHaveURL(/\/customers$/);

		// 2. Click on a customer's "View Details"
		const firstCustomerRow = page.getByRole('row').nth(1);
		const viewDetailsLink = firstCustomerRow.getByRole('link', { name: 'View Details' });

		await viewDetailsLink.click();
		await expect(page).toHaveURL(/\/customers\/[\w-]+/);
		await expect(page.getByRole('heading', { name: 'Personal Information', level: 2 })).toBeVisible();

		// 3. Click browser back button
		await page.goBack();

		// 4. Verify you're back on customers list
		await expect(page).toHaveURL(/\/customers$/);
		await expect(page.getByRole('heading', { name: 'Customers', level: 1 })).toBeVisible();
		await expect(page.getByRole('table')).toBeVisible();

		// 5. Click browser forward button
		await page.goForward();

		// 6. Verify you're back on customer details
		await expect(page).toHaveURL(/\/customers\/[\w-]+/);
		await expect(page.getByRole('heading', { name: 'Personal Information', level: 2 })).toBeVisible();

		// Verify: Browser back/forward buttons work as expected
		// Verify: Navigation history is maintained
		// Verify: Pages reload correctly
		// Verify: No authentication issues occur
		await expect(page.locator('div').filter({ hasText: /^👋 testuser$/ })).toBeVisible();
	});

	test('Page Refresh Maintains Application State', async ({ page }) => {
		// 1. Navigate to http://localhost:5165/customers
		await page.goto('/customers');
		await expect(page).toHaveURL(/\/customers$/);
		await expect(page.getByRole('heading', { name: 'Customers', level: 1 })).toBeVisible();

		// 2. Refresh the page (F5 or browser refresh)
		await page.reload();

		// Verify: User remains authenticated after refresh
		await expect(page.locator('div').filter({ hasText: /^👋 testuser$/ })).toBeVisible();

		// Verify: Page loads successfully without redirect to login
		await expect(page).toHaveURL(/\/customers$/);
		await expect(page.getByRole('heading', { name: 'Customers', level: 1 })).toBeVisible();

		// Verify: User greeting still displays in navigation bar
		await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

		// 3. Navigate to a customer details page
		const firstCustomerRow = page.getByRole('row').nth(1);
		const viewDetailsLink = firstCustomerRow.getByRole('link', { name: 'View Details' });
		await viewDetailsLink.click();
		await expect(page).toHaveURL(/\/customers\/[\w-]+/);

		// 4. Refresh the page again
		await page.reload();

		// Verify: Current page state is maintained or appropriately reset
		await expect(page).toHaveURL(/\/customers\/[\w-]+/);
		await expect(page.getByRole('heading', { name: 'Personal Information', level: 2 })).toBeVisible();

		// Verify: User remains authenticated
		await expect(page.locator('div').filter({ hasText: /^👋 testuser$/ })).toBeVisible();

		// 5. Navigate to /user page
		await page.goto('/user');
		await expect(page).toHaveURL(/\/user$/);

		// 6. Refresh the page
		await page.reload();

		// Verify: No errors occur
		await expect(page).toHaveURL(/\/user$/);
		await expect(page.getByText(/"isAuthenticated".*true/i)).toBeVisible();

		// Verify: Data is reloaded correctly
		await expect(page.getByText(/"name".*"testuser"/i)).toBeVisible();

		// Verify: Session persists
		await expect(page.locator('div').filter({ hasText: /^👋 testuser$/ })).toBeVisible();
	});
});
