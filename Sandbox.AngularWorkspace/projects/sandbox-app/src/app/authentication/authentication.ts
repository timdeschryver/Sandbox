import { httpResource } from '@angular/common/http';
import { DOCUMENT, Injectable, computed, inject } from '@angular/core';
import { User } from '@sandbox-app/authentication/user';
import { parse } from '@sandbox-app/shared/functions';

@Injectable({
	providedIn: 'root',
})
export class Authentication {
	private document = inject(DOCUMENT);

	private _user = httpResource(() => '/bff/user', {
		parse: parse(User),
	}).asReadonly();

	public readonly user = computed(() => this._user.value());

	public login(redirectUrl: string): void {
		this.document.location.href = `/bff/login?returnUrl=${redirectUrl}`;
	}

	public logout(redirectUrl: string): void {
		this.document.location.href = `/bff/logout?returnUrl=${redirectUrl}`;
	}
}
