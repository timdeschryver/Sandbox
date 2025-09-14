import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import Header from './header';
import { Authentication } from '@sandbox-app/authentication/authentication';

const mockUser = signal<{ isAuthenticated: boolean; name: string | null }>({
	isAuthenticated: true,
	name: 'Test User',
});
const mockAuthService = {
	user: mockUser,
};

it('renders anonymous header when user is not authenticated', async () => {
	mockUser.set({ isAuthenticated: false, name: null });

	await render(Header, {
		providers: [provideRouter([]), { provide: Authentication, useValue: mockAuthService }],
	});

	expect(screen.getByText('Login')).toBeInTheDocument();
	expect(screen.getByText('Customers')).toBeInTheDocument();
});

it('renders authenticated header when user is authenticated', async () => {
	mockUser.set({ isAuthenticated: true, name: 'John Doe' });

	await render(Header, {
		providers: [provideRouter([]), { provide: Authentication, useValue: mockAuthService }],
	});

	expect(screen.getByText('👋 Hello, John Doe')).toBeInTheDocument();
	expect(screen.getByText('Logout')).toBeInTheDocument();
	expect(screen.getByText('Customers')).toBeInTheDocument();
});

it('has working navigation links', async () => {
	mockUser.set({ isAuthenticated: true, name: 'John Doe' });

	await render(Header, {
		providers: [
			provideRouter([
				{ path: 'customers', component: Header },
				{ path: 'user', component: Header },
			]),
		],
	});

	const customersLink = screen.getByRole('link', { name: 'Customers' });
	const userLink = screen.getByRole('link', { name: 'Current User' });

	expect(customersLink).toHaveAttribute('href', '/customers');
	expect(userLink).toHaveAttribute('href', '/user');
});
