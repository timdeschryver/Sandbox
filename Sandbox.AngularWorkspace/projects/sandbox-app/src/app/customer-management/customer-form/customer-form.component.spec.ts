import '@testing-library/jest-dom/vitest';
import { expect, it, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { CreateCustomerCommand, CustomerId } from '@sandbox-app/customer-management/models';
import { CustomerFormComponent } from './customer-form.component';
import { AddressComponent } from '@sandbox-app/customer-management/shared/customer-address/customer-address.component';
import { OutputEmitterRef, provideZonelessChangeDetection } from '@angular/core';

it('renders form with initial empty values', async () => {
	await setup();

	expect(screen.getByLabelText(/first name/i)).toHaveValue('');
	expect(screen.getByLabelText(/last name/i)).toHaveValue('');
	expect(screen.getByLabelText(/add billing address/i)).not.toBeChecked();
	expect(screen.getByLabelText(/add shipping address/i)).not.toBeChecked();
});

it('toggles billing address visibility when checkbox is clicked', async () => {
	const { user } = await setup();

	expect(screen.queryByText('Billing Address')).not.toBeInTheDocument();

	await user.click(screen.getByLabelText(/add billing address/i));
	expect(screen.queryByText('Billing Address')).toBeInTheDocument();

	await user.click(screen.getByLabelText(/add billing address/i));
	expect(screen.queryByText('Billing Address')).not.toBeInTheDocument();
});

it('toggles shipping address visibility when checkbox is clicked', async () => {
	const { user } = await setup();

	expect(screen.queryByText('Shipping Address')).not.toBeInTheDocument();

	await user.click(screen.getByLabelText(/add shipping address/i));
	expect(screen.queryByText('Shipping Address')).toBeInTheDocument();
	expect(screen.queryByLabelText(/note/i)).toBeInTheDocument();

	await user.click(screen.getByLabelText(/add shipping address/i));
	expect(screen.queryByText('Shipping Address')).not.toBeInTheDocument();
});

it('submits form with complete data when valid', async () => {
	const { user, mockRequest, onSubmittedSpy } = await setup();

	await user.click(screen.getByRole('button', { name: /create customer/i }));
	expect(screen.queryAllByText('Field is required')).toHaveLength(2);
	expect(onSubmittedSpy).not.toHaveBeenCalled();

	await user.type(screen.getByLabelText(/first name/i), 'John');
	await user.type(screen.getByLabelText(/last name/i), 'Doe');

	await user.click(screen.getByLabelText(/add billing address/i));
	await user.type(screen.getByLabelText(/street/i), '123 Billing St');
	await user.type(screen.getByLabelText(/city/i), 'Bill City');
	await user.type(screen.getByLabelText(/zip code/i), '12345');

	await user.click(screen.getByRole('button', { name: /create customer/i }));

	const request = await mockRequest({});
	const expectedData: CreateCustomerCommand = {
		firstName: 'John',
		lastName: 'Doe',
		billingAddress: {
			street: '123 Billing St',
			city: 'Bill City',
			zipCode: '12345',
		},
		shippingAddress: null,
	};

	expect(request.request.body).toEqual(expectedData);

	expect(onSubmittedSpy).toHaveBeenCalled();

	expect(screen.queryByLabelText(/first name/i)).toHaveValue('');
	expect(screen.queryByLabelText(/last name/i)).toHaveValue('');
});

it('displays error message when API request fails', async () => {
	const { user, mockRequest } = await setup();

	await user.type(screen.getByLabelText(/first name/i), 'John');
	await user.type(screen.getByLabelText(/last name/i), 'Doe');

	await user.click(screen.getByRole('button', { name: /create customer/i }));

	await mockRequest({ title: 'Customer creation failed' }, { status: 500, statusText: 'Bad Request' });

	expect(screen.queryByText('Customer creation failed')).toBeInTheDocument();
	expect(screen.queryByRole('button', { name: /create customer/i })).toBeEnabled();
});

async function setup() {
	const onSubmittedSpy = vi.fn();
	const user = userEvent.setup();

	const { fixture } = await render(CustomerFormComponent, {
		imports: [AddressComponent],
		componentOutputs: {
			submitted: {
				emit: onSubmittedSpy,
			} as unknown as OutputEmitterRef<CustomerId>,
		},
		providers: [provideHttpClient(), provideHttpClientTesting(), provideZonelessChangeDetection()],
	});

	const httpMock = TestBed.inject(HttpTestingController);
	return {
		mockRequest: async (response: object, opts?: object) => {
			const request = httpMock.expectOne({
				url: '/api/customers',
				method: 'POST',
			});
			request.flush(response, opts);

			await fixture.whenStable();
			fixture.detectChanges();

			return request;
		},
		user,
		onSubmittedSpy,
	};
}
