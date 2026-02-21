import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormFieldValidationMessage } from './form-field-validation-error';
import { type FormField } from '@angular/forms/signals';

@Component({
	selector: 'form-validation-form-field-messages',
	imports: [FormFieldValidationMessage],
	template: `
		<div class="text-red-600" [id]="describedby()" [hidden]="!showError()">
			@for (error of field().state().errors(); track $index) {
				{{ error | validationMessage: false }}
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldMessages {
	public readonly field = input.required<FormField<unknown>>();
	public readonly describedby = input.required<string>();

	protected readonly showError = computed(() => {
		return this.field().state().invalid() && this.field().state().touched();
	});
}
