import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { type ActivatedRouteSnapshot, type CanActivateFn, type RouterStateSnapshot } from '@angular/router';
import { Authentication } from '@sandbox-app/authentication/authentication';
import { filterNullish } from '@sandbox-app/shared/operators';
import { map } from 'rxjs';

export const authenticatedGuard: CanActivateFn = (_next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const authenticationService = inject(Authentication);

	return toObservable(authenticationService.user).pipe(
		filterNullish(),
		map((user) => {
			if (user.isAuthenticated) {
				return true;
			}
			authenticationService.login(state.url);
			return false;
		}),
	);
};
