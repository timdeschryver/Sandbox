import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { User } from '@/authentication/user';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private http = inject(HttpClient);
	private _user = httpResource<User>('/bff/user').asReadonly();

	public user = computed(() => this._user.value());
}
