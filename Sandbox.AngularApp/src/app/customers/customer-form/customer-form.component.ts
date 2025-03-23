import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateCustomerRequest } from '@/customers/customer.model';
import { CustomersService } from '@/customers/customers.service';
import { AddressComponent } from '@/customers/shared/customer-address.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'sandbox-customer-form',
	templateUrl: './customer-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, FormsModule, AddressComponent],
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

	protected customer: CreateCustomerRequest = {
		firstName: '',
		lastName: '',
		billingAddress: null,
		shippingAddress: null,
	};

	public readonly submitted = output();

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

		this.customersService.createCustomer(this.customer).subscribe({
			next: () => {
				this.submitState.set({ state: 'idle' });
				form.resetForm();
				this.initializeCustomerModel();
				this.submitted.emit();
			},
			error: (error: unknown) => {
				this.submitState.set({ state: 'error', message: error instanceof HttpErrorResponse ? error.error.title : 'An unexpected error occurred, please try again.' });
			},
		});
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
