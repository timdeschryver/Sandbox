import { expect, it } from 'vitest';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { type CustomerDetailsResponse } from '@sandbox-app/customer-management/models';
import CustomerDetails from './customer-details';
import { generateUuid } from '@sandbox-app/shared/functions';
import { inputBinding, signal } from '@angular/core';

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
	expect(billingAddresses).toMatchInlineSnapshot(`
		<div
		  _ngcontent-a-c2324101917=""
		  class="info-card"
		  data-testid="billing-addresses"
		>
		  <div
		    _ngcontent-a-c2324101917=""
		    class="card-header"
		  >
		    <svg
		      _ngcontent-a-c2324101917=""
		      class="section-icon"
		      fill="none"
		      height="20"
		      stroke="currentColor"
		      stroke-linecap="round"
		      stroke-linejoin="round"
		      stroke-width="2"
		      viewBox="0 0 24 24"
		      width="20"
		      xmlns="http://www.w3.org/2000/svg"
		    >
		      <rect
		        _ngcontent-a-c2324101917=""
		        height="14"
		        rx="2"
		        width="20"
		        x="2"
		        y="5"
		      />
		      <line
		        _ngcontent-a-c2324101917=""
		        x1="2"
		        x2="22"
		        y1="10"
		        y2="10"
		      />
		    </svg>
		    <h2
		      _ngcontent-a-c2324101917=""
		      class="card-title"
		    >
		      Billing Addresses
		    </h2>
		    <span
		      _ngcontent-a-c2324101917=""
		      class="badge"
		    >
		      1
		    </span>
		  </div>
		  <div
		    _ngcontent-a-c2324101917=""
		    class="addresses-grid"
		  >
		    <div
		      _ngcontent-a-c2324101917=""
		      class="address-card"
		    >
		      <div
		        _ngcontent-a-c2324101917=""
		        class="address-row"
		      >
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-label"
		        >
		          Street
		        </span>
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-value"
		        >
		          123 Billing St
		        </span>
		      </div>
		      <div
		        _ngcontent-a-c2324101917=""
		        class="address-row"
		      >
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-label"
		        >
		          City
		        </span>
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-value"
		        >
		          Bill City
		        </span>
		      </div>
		      <div
		        _ngcontent-a-c2324101917=""
		        class="address-row"
		      >
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-label"
		        >
		          Zip Code
		        </span>
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-value"
		        >
		          12345
		        </span>
		      </div>
		    </div>
		    <!--container-->
		  </div>
		</div>
	`);

	const shippingAddresses = screen.queryByTestId('shipping-addresses');
	expect(shippingAddresses).toMatchInlineSnapshot(`
		<div
		  _ngcontent-a-c2324101917=""
		  class="info-card"
		  data-testid="shipping-addresses"
		>
		  <div
		    _ngcontent-a-c2324101917=""
		    class="card-header"
		  >
		    <svg
		      _ngcontent-a-c2324101917=""
		      class="section-icon"
		      fill="none"
		      height="20"
		      stroke="currentColor"
		      stroke-linecap="round"
		      stroke-linejoin="round"
		      stroke-width="2"
		      viewBox="0 0 24 24"
		      width="20"
		      xmlns="http://www.w3.org/2000/svg"
		    >
		      <path
		        _ngcontent-a-c2324101917=""
		        d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
		      />
		    </svg>
		    <h2
		      _ngcontent-a-c2324101917=""
		      class="card-title"
		    >
		      Shipping Addresses
		    </h2>
		    <span
		      _ngcontent-a-c2324101917=""
		      class="badge"
		    >
		      2
		    </span>
		  </div>
		  <div
		    _ngcontent-a-c2324101917=""
		    class="addresses-grid"
		  >
		    <div
		      _ngcontent-a-c2324101917=""
		      class="address-card"
		    >
		      <div
		        _ngcontent-a-c2324101917=""
		        class="address-row"
		      >
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-label"
		        >
		          Street
		        </span>
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-value"
		        >
		          456 Shipping Ave
		        </span>
		      </div>
		      <div
		        _ngcontent-a-c2324101917=""
		        class="address-row"
		      >
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-label"
		        >
		          City
		        </span>
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-value"
		        >
		          Ship City
		        </span>
		      </div>
		      <div
		        _ngcontent-a-c2324101917=""
		        class="address-row"
		      >
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-label"
		        >
		          Zip Code
		        </span>
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-value"
		        >
		          67890
		        </span>
		      </div>
		      <div
		        _ngcontent-a-c2324101917=""
		        class="address-note"
		      >
		        <span
		          _ngcontent-a-c2324101917=""
		          class="note-label"
		        >
		          Note
		        </span>
		        <p
		          _ngcontent-a-c2324101917=""
		          class="note-text"
		        >
		          Leave at door
		        </p>
		      </div>
		      <!--container-->
		    </div>
		    <div
		      _ngcontent-a-c2324101917=""
		      class="address-card"
		    >
		      <div
		        _ngcontent-a-c2324101917=""
		        class="address-row"
		      >
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-label"
		        >
		          Street
		        </span>
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-value"
		        >
		          789 Delivery Rd
		        </span>
		      </div>
		      <div
		        _ngcontent-a-c2324101917=""
		        class="address-row"
		      >
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-label"
		        >
		          City
		        </span>
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-value"
		        >
		          Deliver Town
		        </span>
		      </div>
		      <div
		        _ngcontent-a-c2324101917=""
		        class="address-row"
		      >
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-label"
		        >
		          Zip Code
		        </span>
		        <span
		          _ngcontent-a-c2324101917=""
		          class="address-value"
		        >
		          54321
		        </span>
		      </div>
		      <!--container-->
		    </div>
		    <!--container-->
		  </div>
		</div>
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
