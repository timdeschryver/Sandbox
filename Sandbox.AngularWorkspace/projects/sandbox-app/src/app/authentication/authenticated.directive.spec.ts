import '@testing-library/jest-dom/vitest';
import { expect, it } from 'vitest';
import { AuthenticatedDirective } from './authenticated.directive';
import { render, screen } from '@testing-library/angular';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

it('displays content when the user is authenticated', async () => {
	const { mockRequest } = await setup();
	await mockRequest({ isAuthenticated: true, name: 'Tester', claims: [] });

	expect(screen.queryByText('I am authenticated')).toBeInTheDocument();
});

it('does not display content when the user is unauthenticated', async () => {
	const { mockRequest } = await setup();
	await mockRequest({ isAuthenticated: false, name: null, claims: [] });

	expect(screen.queryByText('I am authenticated')).not.toBeInTheDocument();
});

async function setup() {
	const { fixture } = await render('<div *sandboxAuthenticated>I am authenticated</div>', {
		imports: [AuthenticatedDirective],
		providers: [provideHttpClient(), provideHttpClientTesting(), provideZonelessChangeDetection()],
	});
	const mock = TestBed.inject(HttpTestingController);

	return {
		mockRequest: async (response: object) => {
			const request = mock.expectOne('/bff/user');
			request.flush(response);

			await fixture.whenStable();
			fixture.detectChanges();

			return response;
		},
	};
}
