import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateCustomerCommand, CustomerId } from '@sandbox-app/customer-management/models';
import { CustomersService } from '@sandbox-app/customer-management/customer-management.service';
import { AddressComponent } from '@sandbox-app/customer-management/shared/customer-address/customer-address.component';
import { HttpErrorResponse } from '@angular/common/http';
import { formValidation } from '@form-validation';

@Component({
	selector: 'sandbox-customer-form',
	templateUrl: './customer-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, FormsModule, AddressComponent, formValidation],
})
export class CustomerFormComponent {
	private readonly customersService = inject(CustomersService);
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
