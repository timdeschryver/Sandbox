import { httpResource } from '@angular/common/http';
import { Injectable, computed } from '@angular/core';
import { User } from '@sandbox-app/authentication/user';
import { parse } from '@sandbox-app/shared/functions';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private _user = httpResource('/bff/user', {
		parse: parse(User),
	}).asReadonly();

	public readonly user = computed(() => this._user.value());
}
