import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HttpResourceRef } from '@angular/common/http';
import type { CustomerOverviewResponse } from '@sandbox-app/customer-management/models/customer-overview-response.model';
import { Table } from '@sandbox-app/shared/components/table/table';
import { TableBodyTemplate } from '@sandbox-app/shared/components/table/table-body-template';

@Component({
	selector: 'sandbox-customers-list',
	imports: [Table, TableBodyTemplate, RouterLink],
	templateUrl: './customers-list.html',
	styleUrl: './customers-list.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersList {
	public readonly customers = input.required<HttpResourceRef<CustomerOverviewResponse[] | undefined>>();
}
