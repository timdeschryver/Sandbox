import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Customers } from '@sandbox-app/customer-management/customer-management';
import { stronglyTypedIdAttribute } from '@sandbox-app/shared/functions';
import { CustomerId } from '@sandbox-app/customer-management/models';

@Component({
	selector: 'sandbox-customer-details',
	imports: [RouterLink],
	templateUrl: './customer-details.html',
	styleUrl: './customer-details.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CustomerDetails {
	private readonly customersService = inject(Customers);

	protected readonly customerId = input.required({ transform: stronglyTypedIdAttribute(CustomerId) });
	protected readonly customer = this.customersService.getCustomerDetails(this.customerId);
}
