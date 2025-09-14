import {
	type AfterViewInit,
	Directive,
	ElementRef,
	type Signal,
	ViewContainerRef,
	effect,
	inject,
} from '@angular/core';
import { NgControl, NgModelGroup } from '@angular/forms';
import { ControlErrorComponent } from './control-error.component';
import { FormFieldDirective } from './form-field.directive';

let ERROR_ID = 0;

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ngModel], [ngModelGroup]',
})
export class ErrorDirective implements AfterViewInit {
	private el = inject(ElementRef);
	private readonly viewContainerRef = inject(ViewContainerRef);
	private readonly ngModel = inject(NgControl, { optional: true });
	private readonly ngModelGroup = inject(NgModelGroup, { optional: true });
	private readonly formFieldDirective = inject(FormFieldDirective, { optional: true });

	private errorId = `error-${(++ERROR_ID).toString()}`;

	constructor() {
		const control = (this.ngModel?.control ?? this.ngModelGroup?.control) as unknown as
			| undefined
			| {
					statusReactive: Signal<'VALID' | 'INVALID' | 'DISABLED' | 'PENDING'>;
			  };
		if (control) {
			effect(() => {
				if (control.statusReactive() === 'INVALID') {
					(this.el.nativeElement as HTMLElement).setAttribute('aria-invalid', 'true');
					(this.el.nativeElement as HTMLElement).setAttribute('aria-describedby', this.errorId);
				} else {
					(this.el.nativeElement as HTMLElement).removeAttribute('aria-invalid');
					(this.el.nativeElement as HTMLElement).removeAttribute('aria-describedby');
				}
			});
		}
	}

	public ngAfterViewInit() {
		const control = this.ngModel?.control ?? this.ngModelGroup?.control;
		if (control && !this.formFieldDirective) {
			const errorContainer = this.viewContainerRef.createComponent(ControlErrorComponent);
			errorContainer.setInput('control', control);
			errorContainer.setInput('errorId', this.errorId);
		}
	}
}
