import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ValidationMessagePipe } from './validation-message.pipe';
import type { Control } from '@angular/forms/signals';

@Component({
	selector: 'form-validation-control-errors',
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
export class ControlErrors {
	public readonly control = input.required<Control<unknown>>();
	public readonly describedby = input.required<string>();

	protected readonly showError = computed(() => {
		return this.control().state().invalid() && this.control().state().touched();
	});
}
