import { generateUuid } from '@sandbox-app/shared/functions';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule, type NgForm } from '@angular/forms';
import { type Address } from '@sandbox-app/customer-management/models';
import { formValidation } from '@form-validation';

@Component({
	selector: 'sandbox-customer-address',
	imports: [CommonModule, FormsModule, formValidation],
	templateUrl: './customer-address.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerAddress {
	public readonly form = input.required<NgForm>();
	public readonly address = input.required<Address>();
	protected readonly componentId = generateUuid();
}
