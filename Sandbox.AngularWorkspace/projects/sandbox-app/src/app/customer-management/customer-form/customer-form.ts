import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormsModule, type NgForm } from '@angular/forms';
import { type CreateCustomerCommand, type CustomerId } from '@sandbox-app/customer-management/models';
import { Customers } from '@sandbox-app/customer-management/customer-management';
import { CustomerAddress } from '@sandbox-app/customer-management/shared/customer-address/customer-address';
import { HttpErrorResponse } from '@angular/common/http';
import { formValidation } from '@form-validation';

@Component({
	selector: 'sandbox-customer-form',
	imports: [FormsModule, CustomerAddress, formValidation],
	templateUrl: './customer-form.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerForm {
	private readonly customersService = inject(Customers);
	protected readonly submitState = signal<
		| {
				state: 'idle';
		  }
		| { state: 'pending' }
		| { state: 'error'; message: string }
	>({ state: 'idle' });

	protected customer: CreateCustomerCommand = {
		firstName: '',
		lastName: '',
		billingAddress: null,
		shippingAddress: null,
	};

	public readonly submitted = output<CustomerId>();

	protected toggleBillingAddress(): void {
		this.customer.billingAddress = this.customer.billingAddress
			? null
			: {
					street: '',
					city: '',
					zipCode: '',
				};
	}

	protected toggleShippingAddress(): void {
		this.customer.shippingAddress = this.customer.shippingAddress
			? null
			: {
					street: '',
					city: '',
					zipCode: '',
					note: '',
				};
	}

	protected onSubmit(form: NgForm): void {
		if (form.invalid) {
			return;
		}

		this.submitState.set({ state: 'pending' });
		this.customersService.createCustomer({ ...this.customer }).subscribe({
			next: (response) => {
				this.submitState.set({ state: 'idle' });
				form.resetForm();
				this.initializeCustomerModel();
				this.submitted.emit(response);
			},
			error: (error: unknown) => {
				this.submitState.set({
					state: 'error',
					message:
						error instanceof HttpErrorResponse && this.isErrorWithTitle(error.error)
							? error.error.title
							: 'An unexpected error occurred, please try again.',
				});
			},
		});
	}

	private isErrorWithTitle(error: unknown): error is { title: string } {
		return typeof error === 'object' && error !== null && typeof (error as { title: unknown }).title === 'string';
	}

	private initializeCustomerModel(): void {
		this.customer = {
			firstName: '',
			lastName: '',
			billingAddress: null,
			shippingAddress: null,
		};
	}
}
