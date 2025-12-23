import { expect, it } from 'vitest';
import { HttpTestingController } from '@angular/common/http/testing';
import { render, screen } from '@testing-library/angular';
import { type CustomerOverviewResponse } from '@sandbox-app/customer-management/models';
import CustomersOverview from './customers-overview';
import { TestBed } from '@angular/core/testing';
import { stripUtilAttributes } from '@sandbox-app/test/test-utils';

it('renders the component with customers table', async () => {
	const mockCustomers: CustomerOverviewResponse[] = [
		{ id: 'a8574564-ef6f-42da-9393-67d7e466e8c8', firstName: 'John', lastName: 'Doe' },
		{ id: 'd654bad5-19e1-4728-b019-37d30358524f', firstName: 'Jane', lastName: 'Smith' },
	];

	const { mockRequest, container } = await setup();

	await mockRequest(mockCustomers);

	expect(screen.getByRole('row', { name: /John Doe/i })).toBeInTheDocument();
	expect(screen.getByRole('row', { name: /Jane Smith/i })).toBeInTheDocument();

	const cleanContainer = stripUtilAttributes(container);
	expect(cleanContainer).toMatchSnapshot();
});

async function setup() {
	const { fixture, container } = await render(CustomersOverview, {
		removeAngularAttributes: true,
	});

	const httpMock = TestBed.inject(HttpTestingController);
	return {
		container,
		mockRequest: async (response: object) => {
			const request = httpMock.expectOne('/api/customers');
			request.flush(response);

			await fixture.whenStable();
			fixture.detectChanges();

			return request;
		},
	};
}
