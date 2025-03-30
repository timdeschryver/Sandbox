import { ChangeDetectionStrategy, Component, inject, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomersService } from '@sandbox-app/customers/customers.service';

@Component({
	selector: 'sandbox-customer-details',
	templateUrl: './customer-details.component.html',
	styleUrl: './customer-details.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
})
export default class CustomerDetailsComponent {
	private readonly customersService = inject(CustomersService);

	protected readonly customerId = input.required({ transform: numberAttribute });
	protected readonly customer = this.customersService.getCustomerDetails(this.customerId);
}
