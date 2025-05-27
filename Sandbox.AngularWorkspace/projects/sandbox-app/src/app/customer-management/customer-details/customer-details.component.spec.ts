import { expect, it } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CustomerDetailsResponse } from '@sandbox-app/customer-management/models';
import CustomerDetailsComponent from './customer-details.component';
import { generateUuid } from '@sandbox-app/shared/functions';
import { ActivatedRoute, Router } from '@angular/router';

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

it('displays delete confirmation when delete button is clicked', async () => {
	const { mockRequest, user } = await setup();

	await mockRequest(customerDetails);

	expect(screen.queryByText('Are you sure you want to delete this customer?')).not.toBeInTheDocument();

	await user.click(screen.getByRole('button', { name: /delete customer/i }));
	
	expect(screen.queryByText('Are you sure you want to delete this customer?')).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /confirm delete/i })).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
});

it('hides confirmation when cancel is clicked', async () => {
	const { mockRequest, user } = await setup();

	await mockRequest(customerDetails);

	await user.click(screen.getByRole('button', { name: /delete customer/i }));
	expect(screen.queryByText('Are you sure you want to delete this customer?')).toBeInTheDocument();
	
	await user.click(screen.getByRole('button', { name: /cancel/i }));
	expect(screen.queryByText('Are you sure you want to delete this customer?')).not.toBeInTheDocument();
});

it('deletes customer and navigates to overview when confirmed', async () => {
	const { mockRequest, user, httpMock, router } = await setup();

	const customerId = customerDetails.id;
	await mockRequest(customerDetails);

	await user.click(screen.getByRole('button', { name: /delete customer/i }));
	await user.click(screen.getByRole('button', { name: /confirm delete/i }));
	
	const deleteRequest = httpMock.expectOne(`/api/customers/${customerId}`);
	expect(deleteRequest.request.method).toBe('DELETE');
	deleteRequest.flush({});
	
	await waitFor(() => {
		expect(router.navigate).toHaveBeenCalledWith(['../'], { relativeTo: expect.anything() });
	});
});

it('shows error message when deletion fails', async () => {
	const { mockRequest, user, httpMock } = await setup();

	await mockRequest(customerDetails);

	await user.click(screen.getByRole('button', { name: /delete customer/i }));
	await user.click(screen.getByRole('button', { name: /confirm delete/i }));
	
	const deleteRequest = httpMock.expectOne(`/api/customers/${customerDetails.id}`);
	deleteRequest.flush({ title: 'Deletion failed' }, { status: 500, statusText: 'Server Error' });
	
	await waitFor(() => {
		expect(screen.queryByText('Deletion failed')).toBeInTheDocument();
	});
});

async function setup() {
	const user = userEvent.setup();
	const customerId = generateUuid();
	const routerMock = { navigate: vi.fn() };
	const activatedRouteMock = {};
	
	const { fixture } = await render(CustomerDetailsComponent, {
		inputs: {
			customerId,
		},
		providers: [
			provideHttpClient(), 
			provideHttpClientTesting(),
			{ provide: Router, useValue: routerMock },
			{ provide: ActivatedRoute, useValue: activatedRouteMock }
		],
	});
	const httpMock = TestBed.inject(HttpTestingController);
	return {
		mockRequest: async (response: object, opts?: object) => {
			const request = httpMock.expectOne(`/api/customers/${customerId}`);
			request.flush(response, opts);

			await fixture.whenStable();
			fixture.detectChanges();

			return request;
		},
		user,
		httpMock,
		router: routerMock
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
