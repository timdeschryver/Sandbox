import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomersService } from '@sandbox-app/customer-management/customers.service';
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

	protected readonly customerId = input.required({ transform: stronglyTypedIdAttribute(CustomerId) });
	protected readonly customer = this.customersService.getCustomerDetails(this.customerId);
}
