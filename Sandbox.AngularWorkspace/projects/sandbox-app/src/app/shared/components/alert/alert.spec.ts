import { inputBinding } from '@angular/core';
import { render } from '@testing-library/angular/zoneless';
import { expect, test } from 'vitest';

import { Alert } from './alert';

test.each([
	{ type: 'error' as const, expectedClass: 'bg-red-50' },
	{ type: 'success' as const, expectedClass: 'bg-green-50' },
	{ type: 'warning' as const, expectedClass: 'bg-yellow-50' },
	{ type: 'info' as const, expectedClass: 'bg-blue-50' },
])('renders alert with $type type and $expectedClass class', async ({ type, expectedClass }) => {
	await render(Alert, {
		bindings: [inputBinding('type', () => type)],
	});

	const alert = document.querySelector('div > div');
	expect(alert).toHaveClass(expectedClass);
});
