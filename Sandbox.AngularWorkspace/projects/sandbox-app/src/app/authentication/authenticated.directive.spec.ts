import { expect, it } from 'vitest';
import { AuthenticatedDirective } from './authenticated.directive';
import { render, screen } from '@testing-library/angular';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

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
