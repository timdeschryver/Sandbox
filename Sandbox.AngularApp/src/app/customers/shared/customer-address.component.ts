import { createUuid } from '@/shared/functions/generation';
import { CommonModule } from '@angular/common';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Address } from '@/customers/customer.model';

@Component({
	selector: 'sandbox-customer-address',
	templateUrl: './customer-address.component.html',
	imports: [CommonModule, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
	public readonly form = input.required<NgForm>();
	public readonly address = input.required<Address>();
	protected readonly id = createUuid();
}
