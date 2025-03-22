import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { User } from '@/authentication/user';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private _user = httpResource<User>('/bff/user').asReadonly();

	public readonly user = computed(() => this._user.value());
}
