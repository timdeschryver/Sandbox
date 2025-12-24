import { render } from '@testing-library/angular';
import { Alert } from './alert';
import { expect, test } from 'vitest';
import { inputBinding } from '@angular/core';

test('renders alert with default error type', async () => {
	await render(Alert, {
		bindings: [inputBinding('type', () => 'error')],
	});

	const alert = document.querySelector('div.alert');
	expect(alert).toHaveClass('alert', 'alert-error');
});

test('renders alert with default success type', async () => {
	await render(Alert, {
		bindings: [inputBinding('type', () => 'success')],
	});

	const alert = document.querySelector('div.alert');
	expect(alert).toHaveClass('alert', 'alert-success');
});

test('renders alert with default warning type', async () => {
	await render(Alert, {
		bindings: [inputBinding('type', () => 'warning')],
	});

	const alert = document.querySelector('div.alert');
	expect(alert).toHaveClass('alert', 'alert-warning');
});

test('renders alert with default info type', async () => {
	await render(Alert, {
		bindings: [inputBinding('type', () => 'info')],
	});

	const alert = document.querySelector('div.alert');
	expect(alert).toHaveClass('alert', 'alert-info');
});
