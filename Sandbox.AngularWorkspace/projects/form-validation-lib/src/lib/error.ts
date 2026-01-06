import { type AfterViewInit, Directive, ElementRef, ViewContainerRef, effect, inject } from '@angular/core';
import { FieldErrors } from './field-errors';
import { Field } from '@angular/forms/signals';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[field]',
})
export class Error implements AfterViewInit {
	private el = inject(ElementRef);
	private readonly viewContainerRef = inject(ViewContainerRef);
	private readonly field = inject(Field);

	constructor() {
		effect(() => {
			if (this.field.state().invalid()) {
				(this.el.nativeElement as HTMLElement).setAttribute('aria-invalid', 'true');
				(this.el.nativeElement as HTMLElement).setAttribute(
					'aria-describedby',
					`error-${this.field.state().name()}`,
				);
			} else {
				(this.el.nativeElement as HTMLElement).removeAttribute('aria-invalid');
				(this.el.nativeElement as HTMLElement).removeAttribute('aria-describedby');
			}
		});
	}

	public ngAfterViewInit() {
		const errorContainer = this.viewContainerRef.createComponent(FieldErrors);
		errorContainer.setInput('field', this.field);
		errorContainer.setInput('describedby', `error-${this.field.state().name()}`);
	}
}
