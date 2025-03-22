import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CreateCustomerRequest } from '@/customers/customer.model';
import { CustomersService } from '@/customers/customers.service';
import { AddressComponent } from '@/customers/shared/customer-address.component';

@Component({
	selector: 'sandbox-customer-form',
	templateUrl: './customer-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, FormsModule, AddressComponent],
})
export class CustomerFormComponent {
	private readonly customersService = inject(CustomersService);
	protected readonly isSubmitting = signal(false);
	protected readonly submitError = signal<string | null>(null);
	
	protected customer: CreateCustomerRequest = {
		firstName: '',
		lastName: '',
		billingAddress: null,
		shippingAddress: null,
	};

	public readonly submitted = output<void>();

	protected toggleBillingAddress(): void {
		this.customer.billingAddress = this.customer.billingAddress
			? null
			: {
					street: '',
					city: '',
					zipCode: '',
				}
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

		this.isSubmitting.set(true);
		this.submitError.set(null);

		this.customersService.createCustomer(this.customer).subscribe({
			next: () => {
				this.isSubmitting.set(false);
				form.reset();
				this.initializeCustomerModel();
				this.submitted.emit();
			},
			error: (error) => {
				this.isSubmitting.set(false);
				this.submitError.set('Failed to create customer. Please try again.');
				console.error('Error creating customer:', error);
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