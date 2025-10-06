import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ValidationMessagePipe } from './validation-message.pipe';
import type { Control } from '@angular/forms/signals';

@Component({
	selector: 'form-validation-control-error',
	imports: [ValidationMessagePipe],
	template: `
		<div [id]="describedby()" [hidden]="!showError()">
			@for (error of control().state().errors(); track $index) {
				{{ error | validationMessage: false }}
			}
		</div>
	`,
	styles: ':host { color: var(--error-color) }',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlError {
	public readonly control = input.required<Control<unknown>>();
	public readonly describedby = input.required<string>();

	protected readonly showError = computed(() => {
		// TODO: show error on form submit without marking all as touched
		const controlTouched = this.control().state().touched();
		const controlPristine = !this.control().state().dirty();
		const controlInvalid = this.control().state().invalid();
		return controlInvalid && (controlTouched || !controlPristine);
	});
}
