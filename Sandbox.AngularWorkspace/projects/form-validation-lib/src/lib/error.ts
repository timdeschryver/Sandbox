import { type AfterViewInit, Directive, ElementRef, ViewContainerRef, effect, inject } from '@angular/core';
import { FieldErrors } from './field-errors';
import { FormField } from '@angular/forms/signals';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[formField]',
})
export class Error implements AfterViewInit {
	private el = inject(ElementRef);
	private readonly viewContainerRef = inject(ViewContainerRef);
	private readonly formField = inject(FormField);

	constructor() {
		effect(() => {
			if (this.formField.state().invalid()) {
				(this.el.nativeElement as HTMLElement).setAttribute('aria-invalid', 'true');
				(this.el.nativeElement as HTMLElement).setAttribute(
					'aria-describedby',
					`error-${this.formField.state().name()}`,
				);
			} else {
				(this.el.nativeElement as HTMLElement).removeAttribute('aria-invalid');
				(this.el.nativeElement as HTMLElement).removeAttribute('aria-describedby');
			}
		});
	}

	public ngAfterViewInit() {
		const errorContainer = this.viewContainerRef.createComponent(FieldErrors);
		errorContainer.setInput('field', this.formField);
		errorContainer.setInput('describedby', `error-${this.formField.state().name()}`);
	}
}
