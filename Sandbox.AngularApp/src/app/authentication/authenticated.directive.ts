import { Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from '@/authentication/authentication.service';

@Directive({
	selector: '[sandboxAuthenticated]',
})
export class AuthenticatedDirective {
	private viewContainerRef = inject(ViewContainerRef);
	private templateRef = inject(TemplateRef);
	private authenticationService = inject(AuthenticationService);

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
