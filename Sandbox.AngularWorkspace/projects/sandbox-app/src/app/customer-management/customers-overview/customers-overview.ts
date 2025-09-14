import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Customers } from '@sandbox-app/customer-management/customer-management';
import { Table } from '@sandbox-app/shared/components/table/table';
import { TableBodyTemplate } from '@sandbox-app/shared/components/table/table-body-template';
import { CustomerForm } from '@sandbox-app/customer-management/customer-form/customer-form';

@Component({
	selector: 'sandbox-customers-overview',
	imports: [Table, TableBodyTemplate, CustomerForm, RouterLink],
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
