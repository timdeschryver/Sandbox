import { inject } from '@angular/core';
import { type ActivatedRouteSnapshot, type CanActivateFn, type RouterStateSnapshot } from '@angular/router';
import { Authentication } from '@sandbox-app/authentication/authentication';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { filterNullish } from '@sandbox-app/shared/operators';

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
