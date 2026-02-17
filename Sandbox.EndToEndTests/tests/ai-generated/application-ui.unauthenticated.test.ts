import { test, expect } from '@playwright/test';

test.describe('Public Pages - Unauthenticated', () => {
	test('homepage loads successfully with all navigation elements', async ({ page }) => {
		await page.goto('/');

		// Verify page title
		await expect(page).toHaveTitle('Sandbox');

		// Verify logo and branding
		const logo = page.getByRole('img', { name: 'Sandbox Logo' });
		await expect(logo).toBeVisible();

		const heading = page.getByRole('heading', { name: 'Sandbox', level: 1 });
		await expect(heading).toBeVisible();

		// Verify navigation menu items
		await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Customers' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();

		// Verify theme toggle button exists (default should be available)
		const themeToggle = page.getByRole('button', { name: /Switch to (light|dark) mode/ });
		await expect(themeToggle).toBeVisible();

		// Take screenshot
		await page.screenshot({
			path: 'tests/ai-generated/screenshots/01-homepage-initial.png',
			fullPage: true,
		});
	});

	test('user profile page shows unauthenticated state', async ({ page }) => {
		await page.goto('/user');

		// Verify page title
		await expect(page).toHaveTitle('User');

		// Verify profile heading
		await expect(page.getByRole('heading', { name: 'User Profile', level: 1 })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Profile Information', level: 2 })).toBeVisible();

		// Verify unauthenticated state in JSON display
		const profileInfo = page.locator('text=/.*"isAuthenticated":\\s*false.*/');
		await expect(profileInfo).toBeVisible();

		// Take screenshot
		await page.screenshot({
			path: 'tests/ai-generated/screenshots/06-user-profile-unauthenticated.png',
			fullPage: true,
		});
	});
});

test.describe('Theme Toggle Functionality', () => {
	test('can toggle between dark and light modes', async ({ page }) => {
		await page.goto('/');

		// Get the initial theme button (could be either text)
		const themeButton = page.getByRole('button', { name: /Switch to (light|dark) mode/i });
		await expect(themeButton).toBeVisible();

		// Click to toggle theme
		await themeButton.click();
		await page.screenshot({
			path: 'tests/ai-generated/screenshots/02-dark-mode-enabled.png',
			fullPage: true,
		});

		// Verify button is still visible with updated text
		await expect(themeButton).toBeVisible();

		// Toggle back
		await themeButton.click();
		await page.screenshot({
			path: 'tests/ai-generated/screenshots/07-homepage-light-mode.png',
			fullPage: true,
		});

		// Verify button is still visible
		await expect(themeButton).toBeVisible();
	});
});

test.describe('Navigation', () => {
	test('can navigate between pages using navigation menu', async ({ page }) => {
		await page.goto('/');

		// Navigate to Profile
		await page.getByRole('link', { name: 'Profile' }).click();
		await expect(page).toHaveURL(/\/user/);
		await expect(page).toHaveTitle('User');

		// Navigate back to home using logo - wait for navigation to complete
		await page.getByRole('link', { name: 'Sandbox' }).click();
		await page.waitForURL('/');

		// At home page - verify by checking that we're not on user page
		await expect(page).toHaveURL('/');
	});
});

test.describe('Authentication Flow - Keycloak Integration', () => {
	test('redirects to Keycloak when accessing protected resources', async ({ page }) => {
		await page.goto('/');

		// Click on Customers (protected route)
		await page.getByRole('link', { name: 'Customers' }).click();

		// Should redirect to Keycloak
		await page.waitForURL(/\/realms\/sandbox\/login-actions/);

		// Verify Keycloak login page elements
		await expect(page).toHaveTitle('Sign in to Sandbox Realm');
		await expect(page.getByRole('heading', { name: 'Sign in to your account', level: 1 })).toBeVisible();

		// Verify form elements
		await expect(page.getByRole('textbox', { name: 'Username or email' })).toBeVisible();
		await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
		await expect(page.getByRole('checkbox', { name: 'Remember me' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

		// Verify additional links
		await expect(page.getByRole('link', { name: 'Forgot Password?' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();

		// Take screenshot
		await page.screenshot({
			path: 'tests/ai-generated/screenshots/03-keycloak-login-page.png',
			fullPage: true,
		});
	});

	test('shows validation error when submitting empty login form', async ({ page }) => {
		await page.goto('/customers'); // This will redirect to Keycloak
		await page.waitForURL(/\/realms\/sandbox\/login-actions/);

		// Click Sign In without entering credentials
		await page.getByRole('button', { name: 'Sign In' }).click();

		// Wait for validation error
		await expect(page.locator('text=/Invalid username or password/i')).toBeVisible();

		// Take screenshot
		await page.screenshot({
			path: 'tests/ai-generated/screenshots/04-login-validation-error.png',
			fullPage: true,
		});
	});

	test('shows error when submitting invalid credentials', async ({ page }) => {
		await page.goto('/customers'); // This will redirect to Keycloak
		await page.waitForURL(/\/realms\/sandbox\/login-actions/);

		// Fill in invalid credentials
		await page.getByRole('textbox', { name: 'Username or email' }).fill('invaliduser@example.com');
		await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');

		// Submit form
		await page.getByRole('button', { name: 'Sign In' }).click();

		// Wait for error message
		await expect(page.locator('text=/Invalid username or password/i')).toBeVisible();

		// Verify we're still on the login page
		await expect(page).toHaveTitle('Sign in to Sandbox Realm');

		// Take screenshot
		await page.screenshot({
			path: 'tests/ai-generated/screenshots/05-login-invalid-credentials.png',
			fullPage: true,
		});
	});
});

test.describe('Security - BFF Pattern', () => {
	test('login button points to BFF login endpoint', async ({ page }) => {
		await page.goto('/');

		const loginLink = page.getByRole('link', { name: 'Login' });
		await expect(loginLink).toHaveAttribute('href', '/bff/login');
	});

	test('does not expose authentication tokens in client', async ({ page }) => {
		await page.goto('/user');

		// Check that no tokens are in localStorage
		const localStorageKeys = await page.evaluate(() => Object.keys(localStorage));
		const hasTokens = localStorageKeys.some(
			(key) =>
				key.toLowerCase().includes('token') ||
				key.toLowerCase().includes('access') ||
				key.toLowerCase().includes('id_token'),
		);

		expect(hasTokens).toBe(false);

		// Check that no tokens are in sessionStorage
		const sessionStorageKeys = await page.evaluate(() => Object.keys(sessionStorage));
		const hasSessionTokens = sessionStorageKeys.some(
			(key) =>
				key.toLowerCase().includes('token') ||
				key.toLowerCase().includes('access') ||
				key.toLowerCase().includes('id_token'),
		);

		expect(hasSessionTokens).toBe(false);
	});
});

test.describe('Console and Network Health', () => {
	test('homepage loads without console errors', async ({ page }) => {
		const consoleErrors: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		await page.goto('/');

		// Wait for page to be fully loaded by checking for the main heading
		await page.getByRole('heading', { name: 'Sandbox', level: 1 }).waitFor({ state: 'visible' });

		// We expect no console errors on homepage
		expect(consoleErrors).toHaveLength(0);
	});

	test('verifies no failed network requests on homepage', async ({ page }) => {
		const failedRequests: string[] = [];

		page.on('requestfailed', (request) => {
			failedRequests.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
		});

		await page.goto('/');

		// Wait for page to be fully loaded
		await page.getByRole('heading', { name: 'Sandbox', level: 1 }).waitFor({ state: 'visible' });

		// We expect no failed requests
		expect(failedRequests).toHaveLength(0);
	});
});
