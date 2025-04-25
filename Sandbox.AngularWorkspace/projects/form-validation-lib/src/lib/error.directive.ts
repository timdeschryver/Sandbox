import { AfterViewInit, Directive, ViewContainerRef, inject } from '@angular/core';
import { NgControl, NgModelGroup } from '@angular/forms';
import { ControlErrorComponent } from './control-error.component';
import { FormFieldDirective } from './form-field.directive';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ngModel], [ngModelGroup]',
})
export class ErrorDirective implements AfterViewInit {
	private readonly viewContainerRef = inject(ViewContainerRef);
	private readonly ngModel = inject(NgControl, { optional: true });
	private readonly ngModelGroup = inject(NgModelGroup, { optional: true });
	private readonly formFieldDirective = inject(FormFieldDirective, { optional: true });

	public ngAfterViewInit() {
		setTimeout(() => {
			const control = this.ngModel?.control ?? this.ngModelGroup?.control;
			if (control && !this.formFieldDirective) {
				const errorContainer = this.viewContainerRef.createComponent(ControlErrorComponent);
				errorContainer.setInput('control', control);
			}
		});
	}
}
