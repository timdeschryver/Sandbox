import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { User } from '@/authentication/user';
import { parse } from '@/shared/functions/parse';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private _user = httpResource('/bff/user', {
		parse: parse(User)
	}).asReadonly();

	public readonly user = computed(() => this._user.value());
}
