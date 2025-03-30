import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomersService } from '@sandbox-app/customers/customers.service';
import { TableComponent } from '@sandbox-app/shared/components/table-component/table.component';
import { TableBodyTemplateDirective } from '@sandbox-app/shared/components/table-component/table-body-template.directive';
import { CustomerFormComponent } from '@sandbox-app/customers/customer-form/customer-form.component';

@Component({
	selector: 'sandbox-customers-overview',
	templateUrl: './customers-overview.component.html',
	styleUrl: './customers-overview.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TableComponent, TableBodyTemplateDirective, CustomerFormComponent, RouterLink],
})
export default class CustomersOverviewComponent {
	private readonly customersService = inject(CustomersService);
	protected readonly customers = this.customersService.getOverview();

	protected customerCreated(): void {
		this.customers.reload();
	}
}
