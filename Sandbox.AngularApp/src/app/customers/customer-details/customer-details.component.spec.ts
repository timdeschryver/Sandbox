import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { CustomerDetails } from '@/customers/customer.model';
import CustomerDetailsComponent from './customer-details.component';
import userEvent from '@testing-library/user-event';

it('renders customer details when data is loaded', async () => {
	const { request } = await setup();

	expect(screen.getByText(/Loading customer/i)).toBeInTheDocument();

	request.flush(customerDetails);

	expect(await screen.findByText(/Customer Details/i)).toBeInTheDocument();
	expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
	expect(await screen.findByText(/123 Billing St/i)).toBeInTheDocument();
	expect(await screen.findByText(/456 Shipping Ave/i)).toBeInTheDocument();
	expect(await screen.findByText(/Leave at door/i)).toBeInTheDocument();
	expect(await screen.findByText(/789 Delivery Rd/i)).toBeInTheDocument();

	const billingAddresses = screen.getByRole('group', {
		name: /billing addresses/i,
	});
	expect(billingAddresses).toBeInTheDocument();
	expect(billingAddresses).toHaveTextContent(/123 Billing St/i);
	expect(billingAddresses).toHaveTextContent(/Bill City/i);
	expect(billingAddresses).toHaveTextContent(/12345/i);

	const shippingAddresses = screen.getByRole('group', {
		name: /shipping addresses/i,
	});
	expect(shippingAddresses).toBeInTheDocument();
	expect(shippingAddresses).toHaveTextContent(/456 Shipping Ave/i);
	expect(shippingAddresses).toHaveTextContent(/Ship City/i);
	expect(shippingAddresses).toHaveTextContent(/67890/i);
	expect(shippingAddresses).toHaveTextContent(/Leave at door/i);

	expect(shippingAddresses).toHaveTextContent(/789 Delivery Rd/i);
	expect(shippingAddresses).toHaveTextContent(/Deliver Town/i);
	expect(shippingAddresses).toHaveTextContent(/54321/i);
});

it('does not display address info when no addresses are present', async () => {
	const customerWithNoAddresses: CustomerDetails = {
		...customerDetails,
		billingAddress: [],
		shippingAddress: [],
	};

	const { request } = await setup();
	request.flush(customerWithNoAddresses);

	expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();

	expect(screen.queryByText(/Shipping Addresses/i)).not.toBeInTheDocument();
	expect(screen.queryByText(/Billing Addresses/i)).not.toBeInTheDocument();
});

it('displays error message when API request fails and can retry', async () => {
	const { request, user, httpMock } = await setup();

	expect(screen.getByText(/Loading customer.../i)).toBeInTheDocument();

	request.flush(
		{
			title: 'Something went wrong',
		},
		{ status: 500, statusText: 'Internal Server Error' },
	);

	expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();

	await user.click(screen.getByRole('button', { name: /retry/i }));
	const requestRetry = httpMock.expectOne('/api/customers/1');

	requestRetry.flush(customerDetails);

	expect(await screen.findByText(/Customer Details/i)).toBeInTheDocument();
});

async function setup() {
	const user = userEvent.setup();
	await render(CustomerDetailsComponent, {
		componentInputs: {
			customerId: 1,
		},
		providers: [provideHttpClient(), provideHttpClientTesting()],
	});
	const httpMock = TestBed.inject(HttpTestingController);

	const request = httpMock.expectOne('/api/customers/1');
	return { request, user, httpMock };
}

const customerDetails: CustomerDetails = {
	id: 1,
	firstName: 'John',
	lastName: 'Doe',
	billingAddress: [{ id: 1, street: '123 Billing St', city: 'Bill City', zipCode: '12345' }],
	shippingAddress: [
		{ id: 2, street: '456 Shipping Ave', city: 'Ship City', zipCode: '67890', note: 'Leave at door' },
		{ id: 3, street: '789 Delivery Rd', city: 'Deliver Town', zipCode: '54321' },
	],
};
