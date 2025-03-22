import { createUuid } from '@/shared/functions/generation';
import { CommonModule } from '@angular/common';
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
	selector: 'app-customer-address',
	templateUrl: './customer-address.component.html',
	imports: [CommonModule, FormsModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {
	public readonly form = input.required<NgForm>();
	public readonly address = input.required<{ street: string; city: string; zipCode: string }>();
	protected readonly id = createUuid();
}
