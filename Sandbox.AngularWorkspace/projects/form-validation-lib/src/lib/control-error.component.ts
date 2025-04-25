import { Component, inject, input } from '@angular/core';
import { NgControl, NgForm } from '@angular/forms';
import { ValidationMessagesPipe } from './validation-messages.pipe';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
	selector: 'form-validation-control-error',
	template: `
		<div class="error-message" [hidden]="!shouldShowError()">{{ this.control()?.errors | validationMessages }}</div>
	`,
	styles: '.error-message { color: var(--error-color) }',
	imports: [ValidationMessagesPipe],
})
export class ControlErrorComponent {
	private readonly form = inject(NgForm, { optional: true });
	public readonly control = input<NgControl | undefined>(undefined);

	protected shouldShowError(): boolean {
		return !!this.control()?.invalid && (this.form?.submitted || !!this.control()?.touched || !!this.control()?.dirty);
	}
}
