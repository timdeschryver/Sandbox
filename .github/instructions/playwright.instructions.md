---
description: 'Playwright test generation instructions'
applyTo: '**/Sandbox.EndToEndTests/**/*.test.ts'
---

<!-- Credits to: https://github.com/debs-obrien/debbie.codes/blob/main/.github/instructions/playwright.instructions.md -->

# Test Writing Guidelines

## Code Quality Standards

- **Locators**: Prioritize user-facing, role-based locators (`getByRole`, `getByLabel`, `getByText`, etc.) for resilience and accessibility. Use `test.step()` to group interactions and improve test readability and reporting.
- **Assertions**: Use auto-retrying web-first assertions. These assertions start with the `await` keyword (e.g., `await expect(locator).toHaveText()`). Avoid `expect(locator).toBeVisible()` unless specifically testing for visibility changes.
- **Timeouts**: Rely on Playwright's built-in auto-waiting mechanisms. Avoid hard-coded waits or increased default timeouts.
- **Clarity**: Use descriptive test and step titles that clearly state the intent. Add comments only to explain complex logic or non-obvious interactions.

## Test Structure

- **Imports**: Start with `import { test, expect } from '@playwright/test';`.
- **Organization**: Group related tests for a feature under a `test.describe()` block.
- **Hooks**: Don't use hooks such as `beforeEach` and `afterEach`.
- **Titles**: Follow a clear naming convention, such as `Feature - Specific action or scenario`.

## File Organization

- **Location**: Store generated test files in the `tests/ai-generated` directory.
- **Naming**: Use the convention `<feature-or-domain>.test.ts` (e.g., `customers.test.ts`).
- **Scope**: Aim for one test file per major application feature or page.

## Assertion Best Practices

- **UI Structure**: Use `toMatchAriaSnapshot` to verify the accessibility tree structure of a component. This provides a comprehensive and accessible snapshot.
    - Do not add text content or paragraph content to the yaml. Choose one of the following strategies:
        - Omit the text content entirely - Just reference the element without its text:
        - Use partial text matching - Include just the beginning of the text:
        - Focus on structure over content - Test the presence and hierarchy of elements without their text content.
    - Add `url` to the yaml if not already present. You can find the correct url by navigating to the page with the Playwright MCP Server and viewing the page snapshot.
- **Element Counts**: Use `toHaveCount` to assert the number of elements found by a locator.
- **Text Content**: Use `toHaveText` for exact text matches and `toContainText` for partial matches.
- **Navigation**: Use `toHaveURL` to verify the page URL after an action.
- **Magic values**: Avoid hard-coded values in tests. Use utility functions to generate random strings or numbers for dynamic data (e.g., `generateRandomString(8)`). Use these values in locators and assertions to ensure tests are resilient to changes in the application.
- **Regular Expressions**: For searching strings, use case insensitive regular expressions to create flexible assertions and locators. Preferably use the short syntax: `/text/i` instead of `new RegExp('text', 'i')`.

## Example Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { generateRandomString } from '../utils';

test('creates a new customer and can open details', { tag: '@customer-management' }, async ({ page }) => {
	await page.goto('/customers');

	const firstName = generateRandomString(8);
	const lastName = generateRandomString(10);

	const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
	const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
	const addBillingAddressCheckbox = page.getByRole('checkbox', { name: 'Add Billing Address' });
	const streetTextbox = page.getByRole('textbox', { name: 'Street' });
	const cityTextbox = page.getByRole('textbox', { name: 'City' });
	const zipCodeTextbox = page.getByRole('textbox', { name: 'Zip Code' });

	await test.step(`create customer`, async () => {
		await firstNameTextbox.fill(firstName);
		await lastNameTextbox.fill(lastName);
		await addBillingAddressCheckbox.check();
		await streetTextbox.fill('b street');
		await cityTextbox.fill('b city');
		await zipCodeTextbox.fill('b zip');
		await zipCodeTextbox.press('Enter');
	});

	await test.step(`verify customer is created`, async () => {
		const customerCell = page.getByRole('cell', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		await expect(customerCell).toBeVisible();
	});

	await test.step(`open customer details`, async () => {
		const customerRow = page.getByRole('row', { name: new RegExp(`${firstName} ${lastName}`, 'i') });
		const customerDetailsLink = customerRow.getByRole('link', { name: /details/i });

		await customerDetailsLink.click();

		await expect(page.locator('sandbox-customer-details')).toMatchAriaSnapshot(`
- heading "Customer Details" [level=2]
- link "Back to Overview":
  - /url: /customers
- group "Personal Information": Personal Information Name:${firstName} ${lastName}
- group "Billing Addresses": Billing Addresses Street:b street City:b city Zip Code:b zip
`);
		expect(page.url()).toMatch(/\/customers\/[\w-]+/i);
	});
});
```

## Test Execution Strategy

1. **Initial Run**: Execute tests with `npx playwright test --project=chromium`
2. **Debug Failures**: Analyze test failures and identify root causes
3. **Iterate**: Refine locators, assertions, or test logic as needed
4. **Validate**: Ensure tests pass consistently and cover the intended functionality
5. **Report**: Provide feedback on test results and any issues discovered

## Quality Checklist

Before finalizing tests, ensure:

- [ ] All locators are accessible and specific and avoid strict mode violations
- [ ] Tests are grouped logically and follow a clear structure
- [ ] Assertions are meaningful and reflect user expectations
- [ ] Tests follow consistent naming conventions
- [ ] Code is properly formatted and commented
