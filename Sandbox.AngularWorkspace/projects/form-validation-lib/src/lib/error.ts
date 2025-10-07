import { type AfterViewInit, Directive, ElementRef, ViewContainerRef, effect, inject } from '@angular/core';
import { ControlErrors } from './control-errors';
import { Control } from '@angular/forms/signals';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[control]',
})
export class Error implements AfterViewInit {
	private el = inject(ElementRef);
	private readonly viewContainerRef = inject(ViewContainerRef);
	private readonly control = inject(Control);

	constructor() {
		effect(() => {
			if (this.control.state().invalid()) {
				(this.el.nativeElement as HTMLElement).setAttribute('aria-invalid', 'true');
				(this.el.nativeElement as HTMLElement).setAttribute('aria-describedby', `error-${this.control.state().name()}`);
			} else {
				(this.el.nativeElement as HTMLElement).removeAttribute('aria-invalid');
				(this.el.nativeElement as HTMLElement).removeAttribute('aria-describedby');
			}
		});
	}

	public ngAfterViewInit() {
		const errorContainer = this.viewContainerRef.createComponent(ControlErrors);
		errorContainer.setInput('control', this.control);
		errorContainer.setInput('describedby', `error-${this.control.state().name()}`);
	}
}
