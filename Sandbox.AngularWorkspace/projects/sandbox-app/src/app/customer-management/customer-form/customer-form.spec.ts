import { expect, it, vi } from 'vitest';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { type CreateCustomerCommand } from '@sandbox-app/customer-management/models';
import { CustomerForm } from './customer-form';
import { outputBinding } from '@angular/core';
import { provideEventPlugins } from '@sandbox-app/shared/event-managers';

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
	const { user, mockRequest, customerCreatedSpy: onSubmittedSpy } = await setup();

	const firstNameInput = screen.getByLabelText(/first name/i);
	const lastNameInput = screen.getByLabelText(/last name/i);

	expect(firstNameInput).toHaveAttribute('aria-invalid');
	expect(firstNameInput).toHaveAttribute('aria-describedby');
	expect(lastNameInput).toHaveAttribute('aria-invalid');
	expect(lastNameInput).toHaveAttribute('aria-describedby');

	await user.click(screen.getByRole('button', { name: /create customer/i }));
	expect(screen.queryAllByText('Field is required')).toHaveLength(2);
	expect(onSubmittedSpy).not.toHaveBeenCalled();

	expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
	expect(firstNameInput).toHaveAttribute('aria-describedby');
	expect(lastNameInput).toHaveAttribute('aria-invalid', 'true');
	expect(lastNameInput).toHaveAttribute('aria-describedby');

	await user.type(firstNameInput, 'John');
	await user.type(lastNameInput, 'Doe');

	expect(firstNameInput).not.toHaveAttribute('aria-invalid');
	expect(firstNameInput).not.toHaveAttribute('aria-describedby');
	expect(lastNameInput).not.toHaveAttribute('aria-invalid');
	expect(lastNameInput).not.toHaveAttribute('aria-describedby');

	await user.click(screen.getByLabelText(/add billing address/i));

	const streetInput = screen.getByLabelText(/street/i);
	const cityInput = screen.getByLabelText(/city/i);
	const zipCodeInput = screen.getByLabelText(/zip code/i);

	expect(streetInput).toHaveAttribute('aria-invalid');
	expect(cityInput).toHaveAttribute('aria-invalid');
	expect(zipCodeInput).toHaveAttribute('aria-invalid');

	await user.type(streetInput, '123 Billing St');
	await user.type(cityInput, 'Bill City');
	await user.type(zipCodeInput, '12345');

	expect(streetInput).not.toHaveAttribute('aria-invalid');
	expect(cityInput).not.toHaveAttribute('aria-invalid');
	expect(zipCodeInput).not.toHaveAttribute('aria-invalid');

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

	expect(await screen.findByText(/Customer creation failed/i)).toBeInTheDocument();
	expect(screen.queryByRole('button', { name: /create customer/i })).toBeEnabled();
});

async function setup() {
	const customerCreatedSpy = vi.fn();
	const user = userEvent.setup();

	const { fixture } = await render(CustomerForm, {
		bindings: [outputBinding('customerCreated', customerCreatedSpy)],
		providers: [provideEventPlugins()],
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
		customerCreatedSpy,
	};
}
