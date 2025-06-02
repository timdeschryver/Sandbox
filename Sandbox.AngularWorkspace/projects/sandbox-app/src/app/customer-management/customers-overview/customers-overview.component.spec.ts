import '@testing-library/jest-dom/vitest';
import { it } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { render } from '@testing-library/angular';
import { CustomerOverviewResponse } from '@sandbox-app/customer-management/models';
import CustomersOverviewComponent from './customers-overview.component';
import { TestBed } from '@angular/core/testing';
import { generateUuid } from '@sandbox-app/shared/functions';
import { provideZonelessChangeDetection } from '@angular/core';

it('renders the component with customers table', async () => {
	const mockCustomers: CustomerOverviewResponse[] = [
		{ id: generateUuid(), firstName: 'John', lastName: 'Doe' },
		{ id: generateUuid(), firstName: 'Jane', lastName: 'Smith' },
	];

	const { mockRequest, container: _container } = await setup();

	await mockRequest(mockCustomers);

	// TODO: can't use snapshot testing?
	// expect(container).toMatchInlineSnapshot();
});
async function setup() {
	const { fixture, container } = await render(CustomersOverviewComponent, {
		providers: [provideHttpClient(), provideHttpClientTesting(), provideZonelessChangeDetection()],
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
