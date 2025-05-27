import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomersService } from '@sandbox-app/customer-management/customer-management.service';
import { stronglyTypedIdAttribute } from '@sandbox-app/shared/functions';
import { CustomerId } from '@sandbox-app/customer-management/models';

@Component({
	selector: 'sandbox-customer-details',
	templateUrl: './customer-details.component.html',
	styleUrl: './customer-details.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
})
export default class CustomerDetailsComponent {
	private readonly customersService = inject(CustomersService);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	protected readonly customerId = input.required({ transform: stronglyTypedIdAttribute(CustomerId) });
	protected readonly customer = this.customersService.getCustomerDetails(this.customerId);
	protected readonly showDeleteConfirmation = signal(false);
	protected readonly isDeleting = signal(false);
	protected readonly deleteError = signal<string | null>(null);

	protected toggleDeleteConfirmation(): void {
		this.showDeleteConfirmation.set(!this.showDeleteConfirmation());
		this.deleteError.set(null);
	}

	protected deleteCustomer(): void {
		this.isDeleting.set(true);
		this.deleteError.set(null);
		
		this.customersService.deleteCustomer(this.customerId()).subscribe({
			next: () => {
				this.isDeleting.set(false);
				this.router.navigate(['../'], { relativeTo: this.route });
			},
			error: (error) => {
				this.isDeleting.set(false);
				this.deleteError.set(error?.error?.title || 'An unexpected error occurred while deleting the customer.');
			}
		});
	}
}
