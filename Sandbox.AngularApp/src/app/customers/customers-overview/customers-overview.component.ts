import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CustomersService } from '@/customers/customers.service';
import { TableComponent } from '@/shared/components/table-component/table.component';
import { TableBodyTemplateDirective } from '@/shared/components/table-component/table-body-template.directive';

@Component({
	selector: 'app-customers-overview',
	templateUrl: './customers-overview.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TableComponent, TableBodyTemplateDirective],
})
export default class PeopleComponent {
	private readonly customerService = inject(CustomersService);

	protected readonly customers = this.customerService.getOverview();
}
