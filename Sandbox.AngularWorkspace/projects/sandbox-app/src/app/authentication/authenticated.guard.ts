import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, type CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '@sandbox-app/authentication/authentication.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { filterNullish } from '@sandbox-app/shared/operators';
import { DOCUMENT } from '@angular/common';

export const authenticatedGuard: CanActivateFn = (_next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const user = inject(AuthenticationService);
	const document = inject(DOCUMENT);

	return toObservable(user.user).pipe(
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
