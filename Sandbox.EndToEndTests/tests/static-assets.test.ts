import { test, expect } from '@playwright/test';

test.describe('Static Assets', () => {
	test('security.txt is accessible at /.well-known/security.txt', async ({ page }) => {
		const response = await page.goto('/.well-known/security.txt');

		// Verify successful response
		expect(response?.status()).toBe(200);

		// Verify content type is plain text
		const contentType = response?.headers()['content-type'];
		expect(contentType).toContain('text/plain');

		// Verify the content contains required RFC 9116 fields
		const content = await response?.text();
		expect(content).toContain('Contact:');
		expect(content).toContain('Expires:');

		// Verify it contains the GitHub security advisory link
		expect(content).toContain('https://github.com/timdeschryver/Sandbox/security/advisories/new');
	});

	test('security.txt contains RFC 9116 compliant fields', async ({ page }) => {
		const response = await page.goto('/.well-known/security.txt');
		const content = await response?.text();

		// Verify required fields
		expect(content).toMatch(/Contact:\s+https?:\/\//);
		expect(content).toMatch(/Expires:\s+\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

		// Verify optional but recommended fields
		expect(content).toContain('Preferred-Languages:');
		expect(content).toContain('Policy:');
		expect(content).toContain('Canonical:');
	});
});
