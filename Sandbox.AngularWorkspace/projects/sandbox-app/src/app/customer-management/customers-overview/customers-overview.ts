import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Customers } from '@sandbox-app/customer-management/customer-management';
import { CustomerForm } from '@sandbox-app/customer-management/customer-form/customer-form';
import { CustomersList } from '@sandbox-app/customer-management/customers-list/customers-list';

@Component({
	selector: 'sandbox-customers-overview',
	imports: [CustomersList, CustomerForm],
	templateUrl: './customers-overview.html',
	styleUrl: './customers-overview.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CustomersOverview {
	private readonly customersService = inject(Customers);
	protected readonly customers = this.customersService.getOverview();

	protected customerCreated(): void {
		this.customers.reload();
	}
}
