import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from '@angular/core';
import { NgControl, NgForm } from '@angular/forms';
import { ValidationMessagesPipe } from './validation-messages.pipe';

@Component({
	selector: 'form-validation-control-error',
	imports: [ValidationMessagesPipe],
	template: `
		<div class="error-message" [hidden]="!showError()">{{ this.control()?.errors | validationMessages }}</div>
	`,
	styles: '.error-message { color: var(--error-color) }',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlErrorComponent {
	private readonly form = inject(NgForm, { optional: true });
	public readonly control = input<NgControl | undefined>(undefined);

	// TODO: use official Angular types
	protected readonly showError = computed(() => {
		const formSubmitted =
			(this.form as unknown as undefined | { submittedReactive: Signal<boolean> })?.submittedReactive() ?? false;
		const control = this.control() as unknown as
			| undefined
			| {
					touchedReactive: Signal<boolean>;
					pristineReactive: Signal<boolean>;
					statusReactive: Signal<'VALID' | 'INVALID' | 'DISABLED' | 'PENDING'>;
			  };
		const controlTouched = control?.touchedReactive() ?? false;
		const controlPristine = control?.pristineReactive() ?? true;
		const controlStatus = control?.statusReactive();
		return controlStatus === 'INVALID' && (formSubmitted || controlTouched || !controlPristine);
	});
}
