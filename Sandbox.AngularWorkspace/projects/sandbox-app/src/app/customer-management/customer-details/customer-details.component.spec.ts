import { expect, it } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CustomerDetailsResponse } from '@sandbox-app/customer-management/models';
import CustomerDetailsComponent from './customer-details.component';

it('renders customer details when data is loaded', async () => {
	const { mockRequest } = await setup();

	expect(screen.queryByText(/Loading customer/i)).toBeInTheDocument();

	await mockRequest(customerDetails);

	expect(screen.queryByText(/Customer Details/i)).toBeInTheDocument();
	expect(screen.queryByText(/John Doe/i)).toBeInTheDocument();
	expect(screen.queryByText(/123 Billing St/i)).toBeInTheDocument();
	expect(screen.queryByText(/456 Shipping Ave/i)).toBeInTheDocument();
	expect(screen.queryByText(/Leave at door/i)).toBeInTheDocument();
	expect(screen.queryByText(/789 Delivery Rd/i)).toBeInTheDocument();

	const billingAddresses = screen.queryByRole('group', {
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

	const shippingAddresses = screen.queryByRole('group', {
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
	const customerWithNoAddresses: CustomerDetailsResponse = {
		...customerDetails,
		billingAddresses: [],
		shippingAddresses: [],
	};

	const { mockRequest } = await setup();

	await mockRequest(customerWithNoAddresses);

	expect(screen.queryByText(/John Doe/i)).toBeInTheDocument();

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

	await user.click(screen.getByRole('button', { name: /retry/i }));

	await mockRequest(customerDetails);

	expect(screen.queryByText(/Customer Details/i)).toBeInTheDocument();
});

async function setup() {
	const user = userEvent.setup();
	const { fixture } = await render(CustomerDetailsComponent, {
		inputs: {
			customerId: 1,
		},
		providers: [provideHttpClient(), provideHttpClientTesting()],
	});
	const httpMock = TestBed.inject(HttpTestingController);
	return {
		mockRequest: async (response: object, opts?: object) => {
			const request = httpMock.expectOne('/api/customers/1');
			request.flush(response, opts);

			await fixture.whenStable();
			fixture.detectChanges();

			return request;
		},
		user,
	};
}

const customerDetails: CustomerDetailsResponse = {
	id: 1,
	firstName: 'John',
	lastName: 'Doe',
	billingAddresses: [{ id: 1, street: '123 Billing St', city: 'Bill City', zipCode: '12345' }],
	shippingAddresses: [
		{ id: 2, street: '456 Shipping Ave', city: 'Ship City', zipCode: '67890', note: 'Leave at door' },
		{ id: 3, street: '789 Delivery Rd', city: 'Deliver Town', zipCode: '54321', note: '' },
	],
};
