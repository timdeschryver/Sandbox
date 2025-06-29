import { AfterViewInit, Directive, ElementRef, ViewContainerRef, contentChild, inject } from '@angular/core';
import { NgControl, NgModelGroup } from '@angular/forms';
import { ControlErrorComponent } from './control-error.component';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[formField]',
})
export class FormFieldDirective implements AfterViewInit {
	private readonly element = inject(ElementRef);
	private readonly viewContainerRef = inject(ViewContainerRef);
	private readonly ngModelGroup = inject(NgModelGroup, { optional: true });
	private readonly ngModelChild = contentChild(NgControl);
	private readonly ngModelGroupChild = contentChild(NgModelGroup);

	public ngAfterViewInit() {
		const control = this.ngModelGroup?.control ?? this.ngModelChild()?.control ?? this.ngModelGroupChild()?.control;
		if (control) {
			this.viewContainerRef.clear();

			const errorContainer = this.viewContainerRef.createComponent(ControlErrorComponent);

			const host = this.element.nativeElement as HTMLElement;
			host.style.flexWrap = 'wrap';
			host.appendChild(errorContainer.location.nativeElement);

			errorContainer.setInput('control', control);
		}
	}
}
