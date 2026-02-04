import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ValidationMessagePipe } from './validation-message.pipe';
import { type FormField } from '@angular/forms/signals';

@Component({
	selector: 'form-validation-field-errors',
	imports: [ValidationMessagePipe],
	template: `
		<div [id]="describedby()" [hidden]="!showError()">
			@for (error of field().state().errors(); track $index) {
				{{ error | validationMessage: false }}
			}
		</div>
	`,
	styles: ':host { color: var(--color-error) }',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldErrors {
	public readonly field = input.required<FormField<unknown>>();
	public readonly describedby = input.required<string>();

	protected readonly showError = computed(() => {
		return this.field().state().invalid() && this.field().state().touched();
	});
}
