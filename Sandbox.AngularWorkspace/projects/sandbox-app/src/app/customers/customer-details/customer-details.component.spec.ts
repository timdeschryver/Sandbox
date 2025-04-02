import { expect, it } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CustomerDetails } from '@sandbox-app/customers/customer.model';
import CustomerDetailsComponent from './customer-details.component';

it('renders customer details when data is loaded', async () => {
	const { mockRequest } = await setup();
	const request = mockRequest();

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
	expect(billingAddresses).toMatchInlineSnapshot(`
      <fieldset>
        <legend>
          Billing Addresses
        </legend>
        <div>
          <div>
            <span>
              Street:
            </span>
            <span>
              123 Billing St
            </span>
          </div>
          <div>
            <span>
              City:
            </span>
            <span>
              Bill City
            </span>
          </div>
          <div>
            <span>
              Zip Code:
            </span>
            <span>
              12345
            </span>
          </div>
        </div>
        <!--container-->
      </fieldset>
    `);

	const shippingAddresses = screen.getByRole('group', {
		name: /shipping addresses/i,
	});
	expect(shippingAddresses).toMatchInlineSnapshot(`
      <fieldset>
        <legend>
          Shipping Addresses
        </legend>
        <div>
          <div>
            <span>
              Street:
            </span>
            <span>
              456 Shipping Ave
            </span>
          </div>
          <div>
            <span>
              City:
            </span>
            <span>
              Ship City
            </span>
          </div>
          <div>
            <span>
              Zip Code:
            </span>
            <span>
              67890
            </span>
          </div>
          <div>
            <span>
              Note:
            </span>
            <span>
              Leave at door
            </span>
          </div>
          <!--container-->
        </div>
        <div>
          <div>
            <span>
              Street:
            </span>
            <span>
              789 Delivery Rd
            </span>
          </div>
          <div>
            <span>
              City:
            </span>
            <span>
              Deliver Town
            </span>
          </div>
          <div>
            <span>
              Zip Code:
            </span>
            <span>
              54321
            </span>
          </div>
          <!--container-->
        </div>
        <!--container-->
      </fieldset>
    `);
});

it('does not display address info when no addresses are present', async () => {
	const customerWithNoAddresses: CustomerDetails = {
		...customerDetails,
		billingAddresses: [],
		shippingAddresses: [],
	};

	const { mockRequest } = await setup();
	const request = mockRequest();
	request.flush(customerWithNoAddresses);

	expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();

	expect(screen.queryByText(/Shipping Addresses/i)).not.toBeInTheDocument();
	expect(screen.queryByText(/Billing Addresses/i)).not.toBeInTheDocument();
});

it('displays error message when API request fails and can retry', async () => {
	const { mockRequest, user } = await setup();
	const request = mockRequest();

	expect(screen.getByText(/Loading customer.../i)).toBeInTheDocument();

	request.flush(
		{
			title: 'Something went wrong',
		},
		{ status: 500, statusText: 'Internal Server Error' },
	);

	expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();

	await user.click(screen.getByRole('button', { name: /retry/i }));
	const requestRetry = mockRequest();

	requestRetry.flush(customerDetails);

	expect(await screen.findByText(/Customer Details/i)).toBeInTheDocument();
});

async function setup() {
	const user = userEvent.setup();
	await render(CustomerDetailsComponent, {
		inputs: {
			customerId: 1,
		},
		providers: [provideHttpClient(), provideHttpClientTesting()],
	});
	const httpMock = TestBed.inject(HttpTestingController);
	return { mockRequest: () => httpMock.expectOne(() => true), user };
}

const customerDetails: CustomerDetails = {
	id: 1,
	firstName: 'John',
	lastName: 'Doe',
	billingAddresses: [{ id: 1, street: '123 Billing St', city: 'Bill City', zipCode: '12345' }],
	shippingAddresses: [
		{ id: 2, street: '456 Shipping Ave', city: 'Ship City', zipCode: '67890', note: 'Leave at door' },
		{ id: 3, street: '789 Delivery Rd', city: 'Deliver Town', zipCode: '54321', note: '' },
	],
};
