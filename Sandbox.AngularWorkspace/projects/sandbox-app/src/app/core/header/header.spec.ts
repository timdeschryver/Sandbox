import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import Header from './header';
import { Authentication } from '@sandbox-app/authentication/authentication';

it('renders anonymous header when user is not authenticated', async () => {
	await setup({ isAuthenticated: false, name: null });

	expect(screen.getByText('Login')).toBeInTheDocument();
	expect(screen.getByText('Customers')).toBeInTheDocument();
});

it('renders authenticated header when user is authenticated', async () => {
	await setup({ isAuthenticated: true, name: 'John Doe' });

	expect(screen.getByText(/John Doe/)).toBeInTheDocument();
	expect(screen.getByText('Logout')).toBeInTheDocument();
	expect(screen.getByText('Customers')).toBeInTheDocument();
});

it('has working navigation links', async () => {
	await setup({ isAuthenticated: true, name: 'John Doe' });

	const customersLink = screen.getByRole('link', { name: 'Customers' });
	const userLink = screen.getByRole('link', { name: 'Profile' });

	expect(customersLink).toHaveAttribute('href', '/customers');
	expect(userLink).toHaveAttribute('href', '/user');
});

function setup(user: { isAuthenticated: boolean; name: string | null }) {
	const mockAuthService = {
		user: signal(user),
	};

	return render(Header, {
		providers: [provideRouter([]), { provide: Authentication, useValue: mockAuthService }],
	});
}
