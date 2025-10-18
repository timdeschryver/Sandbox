import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Field, type FieldTree } from '@angular/forms/signals';
import { formValidation } from '@form-validation';
import { type Address } from '@sandbox-app/customer-management/models';

@Component({
	selector: 'sandbox-customer-address',
	imports: [Field, formValidation],
	templateUrl: './customer-address.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerAddress {
	public readonly address = input.required<FieldTree<Address>>();
}
