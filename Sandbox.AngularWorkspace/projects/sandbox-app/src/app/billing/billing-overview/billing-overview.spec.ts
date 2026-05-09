import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/angular/zoneless';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import BillingOverview from './billing-overview';

it('displays loading state', async () => {
	await render(BillingOverview);
	expect(await screen.findByText('Loading billing data...')).toBeInTheDocument();
});

it('displays billing overview message', async () => {
	const { mockRequest } = await setup();

	await mockRequest({ message: 'Test message' });

	expect(screen.getByText('Test message')).toBeInTheDocument();
});

it('displays error alert', async () => {
	const { mockRequest } = await setup();

	await mockRequest({ message: 'Error occurred' }, { status: 500, statusText: 'Server Error' });

	expect(
		screen.getByText(
			/Failed to load billing overview: Http failure response for \/api\/billing: 500 Server Error/,
		),
	).toBeInTheDocument();
});

async function setup() {
	const { fixture } = await render(BillingOverview);
	const httpMock = TestBed.inject(HttpTestingController);

	return {
		mockRequest: async (response: object, opts?: object) => {
			const request = httpMock.expectOne('/api/billing');
			request.flush(response, opts);

			await fixture.whenStable();

			return request;
		},
	};
}
