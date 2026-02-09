import { expect, it } from 'vitest';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { type CustomerDetailsResponse } from '@sandbox-app/customer-management/models';
import CustomerDetails from './customer-details';
import { generateUuid } from '@sandbox-app/shared/functions';
import { inputBinding, signal } from '@angular/core';
import { stripUtilAttributes } from '@sandbox-app/test/test-utils';

it('renders customer details when data is loaded', async () => {
	const { mockRequest } = await setup();

	expect(screen.queryByText(/Loading customer/i)).toBeInTheDocument();

	await mockRequest(customerDetails);

	expect(screen.queryByText(/Personal information/i)).toBeInTheDocument();
	expect(screen.queryAllByText(/John Doe/i)).toHaveLength(2);
	expect(screen.queryByText(/123 Billing St/i)).toBeInTheDocument();
	expect(screen.queryByText(/456 Shipping Ave/i)).toBeInTheDocument();
	expect(screen.queryByText(/Leave at door/i)).toBeInTheDocument();
	expect(screen.queryByText(/789 Delivery Rd/i)).toBeInTheDocument();

	const billingAddresses = screen.queryByTestId('billing-addresses');
	expect(billingAddresses).toBeInTheDocument();
	expect(stripUtilAttributes(billingAddresses)).toMatchSnapshot();

	const shippingAddresses = screen.queryByTestId('shipping-addresses');
	expect(stripUtilAttributes(shippingAddresses)).toMatchSnapshot();
});

it('does not display address info when no addresses are present', async () => {
	const customerWithNoAddresses: CustomerDetailsResponse = {
		...customerDetails,
		billingAddresses: [],
		shippingAddresses: [],
	};

	const { mockRequest } = await setup();

	await mockRequest(customerWithNoAddresses);

	expect(screen.queryAllByText(/John Doe/i)).toHaveLength(2);

	expect(screen.queryByText(/Shipping Addresses/i)).not.toBeInTheDocument();
	expect(screen.queryByText(/Billing Addresses/i)).not.toBeInTheDocument();
});

it('displays error message when API request fails and can retry', async () => {
	const { mockRequest, user } = await setup();

	expect(screen.queryByText(/Loading customer.../i)).toBeInTheDocument();

	await mockRequest(
		{
			title: 'Something went wrong',
		},
		{ status: 500, statusText: 'Internal Server Error' },
	);

	expect(screen.queryByText(/Something went wrong/i)).toBeInTheDocument();

	await user.click(screen.getByRole('button', { name: /Try again/i }));

	await mockRequest(customerDetails);

	expect(screen.queryByText(/Personal information/i)).toBeInTheDocument();
});

async function setup() {
	const user = userEvent.setup();
	const customerId = signal(generateUuid());
	const { fixture } = await render(CustomerDetails, {
		bindings: [inputBinding('customerId', customerId)],
	});
	const httpMock = TestBed.inject(HttpTestingController);
	return {
		mockRequest: async (response: object, opts?: object) => {
			const request = httpMock.expectOne(`/api/customers/${customerId()}`);
			request.flush(response, opts);

			await fixture.whenStable();
			fixture.detectChanges();

			return request;
		},
		user,
	};
}

const customerDetails: CustomerDetailsResponse = {
	id: generateUuid(),
	firstName: 'John',
	lastName: 'Doe',
	billingAddresses: [{ id: generateUuid(), street: '123 Billing St', city: 'Bill City', zipCode: '12345' }],
	shippingAddresses: [
		{ id: generateUuid(), street: '456 Shipping Ave', city: 'Ship City', zipCode: '67890', note: 'Leave at door' },
		{ id: generateUuid(), street: '789 Delivery Rd', city: 'Deliver Town', zipCode: '54321', note: '' },
	],
};
