import { inject } from '@angular/core';
import { type ActivatedRouteSnapshot, type CanActivateFn, type RouterStateSnapshot } from '@angular/router';
import { Authentication } from '@sandbox-app/authentication/authentication';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { filterNullish } from '@sandbox-app/shared/operators';
import { DOCUMENT } from '@angular/common';

export const authenticatedGuard: CanActivateFn = (_next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const authenticationService = inject(Authentication);
	const document = inject(DOCUMENT);

	return toObservable(authenticationService.user).pipe(
		filterNullish(),
		map((user) => {
			if (user.isAuthenticated) {
				return true;
			}
			document.location.href = `/bff/login?returnUrl=${state.url}`;
			return false;
		}),
	);
};
