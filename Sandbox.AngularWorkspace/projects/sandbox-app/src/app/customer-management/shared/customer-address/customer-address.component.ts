import { generateUuid } from '@sandbox-app/shared/functions';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Address } from '@sandbox-app/customer-management/models';

@Component({
	selector: 'sandbox-customer-address',
	templateUrl: './customer-address.component.html',
	imports: [CommonModule, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
	public readonly form = input.required<NgForm>();
	public readonly address = input.required<Address>();
	protected readonly componentId = generateUuid();
}
