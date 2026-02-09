import { expect, test } from 'vitest';
import { inputBinding } from '@angular/core';
import { render } from '@testing-library/angular';
import { Alert, type AlertType } from './alert';

test.each([
	{ type: 'error' as AlertType, expectedClass: 'bg-red-50' },
	{ type: 'success' as AlertType, expectedClass: 'bg-green-50' },
	{ type: 'warning' as AlertType, expectedClass: 'bg-yellow-50' },
	{ type: 'info' as AlertType, expectedClass: 'bg-blue-50' },
])('renders alert with $type type and $expectedClass class', async ({ type, expectedClass }) => {
	await render(Alert, {
		bindings: [inputBinding('type', () => type)],
	});

	const alert = document.querySelector('div > div');
	expect(alert).toHaveClass(expectedClass);
});
