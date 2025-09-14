import { Directive, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { Authentication } from '@sandbox-app/authentication/authentication';

@Directive({
	selector: '[sandboxAuthenticated]',
})
export class Authenticated {
	private viewContainerRef = inject(ViewContainerRef);
	private templateRef = inject(TemplateRef);
	private authenticationService = inject(Authentication);

	constructor() {
		effect(() => {
			if (this.authenticationService.user()?.isAuthenticated) {
				this.viewContainerRef.createEmbeddedView(this.templateRef);
			} else {
				this.viewContainerRef.clear();
			}
		});
	}
}
